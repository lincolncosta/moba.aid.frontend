import React, { memo, useCallback, useEffect, useReducer, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { getSugestao } from 'api/sugestao'
import { getPredicao } from 'api/predicao'
import { iniciarSessao } from 'api/sessao'
import { Box } from 'components/Box'
import { Text } from 'components/Text'
import { Button } from 'components/Button'
import { PicksBans } from 'components/PicksBans'
import { CardBlueSide } from 'components/CardBlueSide'
import { CardRedSide } from 'components/CardRedSide'
import { CampeaoBanido } from 'components/CampeaoBanido'
import { Campeao } from 'components/Campeao'
import campeoesDataset from 'database/champions.json'

// Full 20-step draft: Ban Phase 1 (6) → Pick Phase 1 (6) → Ban Phase 2 (4) → Pick Phase 2 (4)
const DRAFT_SEQUENCE = [
  { phase: 'ban',  team: 'BLUE' }, // 0
  { phase: 'ban',  team: 'RED'  }, // 1
  { phase: 'ban',  team: 'BLUE' }, // 2
  { phase: 'ban',  team: 'RED'  }, // 3
  { phase: 'ban',  team: 'BLUE' }, // 4
  { phase: 'ban',  team: 'RED'  }, // 5
  { phase: 'pick', team: 'BLUE' }, // 6  — Pick 1
  { phase: 'pick', team: 'RED'  }, // 7  — Pick 2
  { phase: 'pick', team: 'RED'  }, // 8  — Pick 3
  { phase: 'pick', team: 'BLUE' }, // 9  — Pick 4
  { phase: 'pick', team: 'BLUE' }, // 10 — Pick 5
  { phase: 'pick', team: 'RED'  }, // 11 — Pick 6
  { phase: 'ban',  team: 'RED'  }, // 12 — Red opens Ban Phase 2
  { phase: 'ban',  team: 'BLUE' }, // 13
  { phase: 'ban',  team: 'RED'  }, // 14
  { phase: 'ban',  team: 'BLUE' }, // 15
  { phase: 'pick', team: 'RED'  }, // 16 — Pick 7
  { phase: 'pick', team: 'BLUE' }, // 17 — Pick 8
  { phase: 'pick', team: 'BLUE' }, // 18 — Pick 9
  { phase: 'pick', team: 'RED'  }, // 19 — Pick 10
]

const BLUE_BAN_STEPS  = [0, 2, 4, 13, 15]
const RED_BAN_STEPS   = [1, 3, 5, 12, 14]
const BLUE_PICK_STEPS = [6, 9, 10, 17, 18]
const RED_PICK_STEPS  = [7, 8, 11, 16, 19]

const ROLE_LABELS = { top: 'Top', jng: 'Jungle', mid: 'Mid', bot: 'Bot', sup: 'Support' }

// The API uses the DDragon alias as champion name for two champions whose display
// names differ: "Nunu" → "Nunu & Willump", "Renata" → "Renata Glasc".
// Try exact display name first, fall back to alias so either format resolves correctly.
const findChampion = (apiName) =>
  campeoesDataset.find(c => c.name  === apiName) ||
  campeoesDataset.find(c => c.alias === apiName)

const ROLE_OPTIONS = [
  { value: 'top', label: 'Top' },
  { value: 'jng', label: 'Jungle' },
  { value: 'mid', label: 'Mid' },
  { value: 'bot', label: 'Bot' },
  { value: 'sup', label: 'Support' },
]

const RoleSelect = styled.select`
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 14px;
  cursor: pointer;
`

const CONFIDENCE_LABELS = { low: 'Low', medium: 'Medium', high: 'High' }

const mensagemDeErro = (err) =>
  err?.response?.data?.error || err?.message || 'Unknown error'

function getPhaseLabel(step) {
  if (step < 6)  return 'Ban Phase 1'
  if (step < 12) return 'Pick Phase 1'
  if (step < 16) return 'Ban Phase 2'
  if (step < 20) return 'Pick Phase 2'
  return 'Draft Complete'
}

// ─── Reducer ─────────────────────────────────────────────────────────────────
// All draft mutations are atomic: champion recorded + step advanced in one dispatch.

const initialState = {
  step: 0,
  blueBans:  [null, null, null, null, null],
  redBans:   [null, null, null, null, null],
  bluePicks: [null, null, null, null, null],
  redPicks:  [null, null, null, null, null],
  agTeam: {}, // GA's picks as { role: championName }, used for /suggest and /predict
}

function draftReducer(state, action) {
  switch (action.type) {
    case 'BAN': {
      const bans = action.isBlue ? [...state.blueBans] : [...state.redBans]
      bans[action.slot] = action.champion
      return action.isBlue
        ? { ...state, blueBans: bans, step: state.step + 1 }
        : { ...state, redBans:  bans, step: state.step + 1 }
    }
    case 'PICK': {
      const pick = { campeao: action.champion, rota: action.rota }
      const agTeam = action.isAI && action.rota
        ? { ...state.agTeam, [action.rota.value]: action.champion.name }
        : state.agTeam
      const picks = action.isBlue ? [...state.bluePicks] : [...state.redPicks]
      picks[action.slot] = pick
      return action.isBlue
        ? { ...state, bluePicks: picks, agTeam, step: state.step + 1 }
        : { ...state, redPicks:  picks, agTeam, step: state.step + 1 }
    }
    default: return state
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export const Draft = memo(() => {
  const history = useHistory()
  const meuTime = history.location.state?.meuTime
  // Campeões marcados na etapa Fearless (antes da escolha do lado)
  const fearlessChampions = history.location.state?.fearless || []

  const [draft, dispatch]                             = useReducer(draftReducer, initialState)
  const [targetComposition, setTargetComposition]     = useState(null)
  const [loading, setLoading]                         = useState(false)
  const [solicitacaoPendente, setSolicitacaoPendente] = useState(false)
  const [userRoles, setUserRoles]                     = useState([null, null, null, null, null])
  const [loadingPredicao, setLoadingPredicao]         = useState(false)
  const [predicao, setPredicao]                       = useState(null)
  const [erro, setErro]                               = useState(null)
  const [tentativaInicio, setTentativaInicio]         = useState(0)

  const { step, blueBans, redBans, bluePicks, redPicks, agTeam } = draft

  const isDraftComplete  = step >= 20
  const currentPhase     = isDraftComplete ? null : DRAFT_SEQUENCE[step].phase
  const currentTeam      = isDraftComplete ? null : DRAFT_SEQUENCE[step].team
  const isAITurn         = !isDraftComplete && currentTeam !== meuTime
  const userPicks        = meuTime === 'BLUE' ? bluePicks : redPicks
  const allRolesAssigned = userRoles.every(r => r !== null)

  // Slot index of whichever card should be highlighted as "active" right now
  const currentBlueBanSlot  = !isDraftComplete && currentPhase === 'ban'  && currentTeam === 'BLUE' ? BLUE_BAN_STEPS.indexOf(step)  : -1
  const currentRedBanSlot   = !isDraftComplete && currentPhase === 'ban'  && currentTeam === 'RED'  ? RED_BAN_STEPS.indexOf(step)   : -1
  const currentBluePickSlot = !isDraftComplete && currentPhase === 'pick' && currentTeam === 'BLUE' ? BLUE_PICK_STEPS.indexOf(step) : -1
  const currentRedPickSlot  = !isDraftComplete && currentPhase === 'pick' && currentTeam === 'RED'  ? RED_PICK_STEPS.indexOf(step) : -1

  // Champions the picker must block out (already fearless, banned or picked)
  const bloqueados = [
    ...fearlessChampions,
    ...blueBans.filter(Boolean),
    ...redBans.filter(Boolean),
    ...bluePicks.filter(Boolean).map(p => p.campeao),
    ...redPicks.filter(Boolean).map(p => p.campeao),
  ]

  // Sem lado escolhido (acesso direto a /draft): volta ao início
  useEffect(() => {
    if (!meuTime) history.replace('/')
  }, [meuTime, history])

  // ── Call /start to get the initial targetComposition (Fearless incluído) ──
  useEffect(() => {
    if (!meuTime) return
    const agSide   = meuTime === 'BLUE' ? 'red' : 'blue'
    const userSide = meuTime === 'BLUE' ? 'blue' : 'red'
    setErro(null)
    iniciarSessao({ agSide, userSide, fearless: fearlessChampions.map(c => c.name) })
      .then((sessao) => setTargetComposition(sessao.targetComposition))
      .catch((err) => setErro(`Could not start the draft: ${mensagemDeErro(err)}`))
  }, [tentativaInicio]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Record a step and advance ─────────────────────────────────────────────
  const confirmarPasso = useCallback((champion, rota = null) => {
    if (step >= 20) return
    const { phase, team } = DRAFT_SEQUENCE[step]
    const isBlue = team === 'BLUE'
    const isAI   = team !== meuTime

    if (phase === 'ban') {
      dispatch({
        type: 'BAN', champion, isBlue,
        slot: isBlue ? BLUE_BAN_STEPS.indexOf(step) : RED_BAN_STEPS.indexOf(step),
      })
    } else {
      dispatch({
        type: 'PICK', champion, rota, isBlue, isAI,
        slot: isBlue ? BLUE_PICK_STEPS.indexOf(step) : RED_PICK_STEPS.indexOf(step),
      })
    }
    setSolicitacaoPendente(false)
  }, [step, meuTime])

  // ── AI turn: call /suggest and confirm result ─────────────────────────────
  const chamarIA = useCallback(async () => {
    if (solicitacaoPendente || erro) return
    setSolicitacaoPendente(true)
    setLoading(true)

    try {
      const { phase } = DRAFT_SEQUENCE[step]
      const bannedNames   = [...blueBans.filter(Boolean).map(c => c.name), ...redBans.filter(Boolean).map(c => c.name)]
      const userTeamNames = meuTime === 'RED'
        ? redPicks.filter(Boolean).map(p => p.campeao.name)
        : bluePicks.filter(Boolean).map(p => p.campeao.name)

      const sugestao = await getSugestao({
        goal:              phase === 'ban' ? 'ban' : 'pick',
        agTeam,
        userTeam:          userTeamNames,
        banned:            bannedNames,
        fearless:          fearlessChampions.map(c => c.name),
        targetComposition,
      })

      // Keep targetComposition fresh for the next /suggest call
      if (sugestao.targetComposition) {
        setTargetComposition(sugestao.targetComposition)
      }

      const campeao = findChampion(sugestao.champion)
      if (!campeao) {
        setErro(`The AI chose "${sugestao.champion}", which is missing from the local champion list.`)
        setSolicitacaoPendente(false)
        return
      }
      const rota = sugestao.role
        ? { value: sugestao.role, label: ROLE_LABELS[sugestao.role] || sugestao.role }
        : null

      confirmarPasso(campeao, rota)
    } catch (err) {
      setErro(`The AI could not make its move: ${mensagemDeErro(err)}`)
      setSolicitacaoPendente(false)
    } finally {
      setLoading(false)
    }
  }, [solicitacaoPendente, erro, step, meuTime, blueBans, redBans, bluePicks, redPicks, agTeam, fearlessChampions, targetComposition, confirmarPasso])

  // ── Trigger AI on its turn (after /start has returned, while there is no error) ──
  useEffect(() => {
    if (targetComposition && !erro && !isDraftComplete && isAITurn && !solicitacaoPendente && !loading) {
      chamarIA()
    }
  }, [step, targetComposition, erro, isDraftComplete, isAITurn, solicitacaoPendente, loading, chamarIA])

  const tentarNovamente = () => {
    setErro(null)
    if (!targetComposition) setTentativaInicio((n) => n + 1)
  }

  // ── Fetch prediction on explicit user request ─────────────────────────────
  const handlePredict = async () => {
    setLoadingPredicao(true)
    setErro(null)
    try {
      const userSide = meuTime.toLowerCase()
      const aiSide   = meuTime === 'BLUE' ? 'red' : 'blue'
      const paramsPredicao = {
        ...Object.fromEntries(
          Object.entries(agTeam).map(([role, champ]) => [`${role}_${aiSide}`, champ])
        ),
        ...Object.fromEntries(
          userRoles.map((role, i) => [`${role}_${userSide}`, userPicks[i].campeao.name])
        ),
      }
      const result = await getPredicao(paramsPredicao)
      setPredicao(result)
    } catch (err) {
      setErro(`Could not predict the winner: ${mensagemDeErro(err)}`)
    } finally {
      setLoadingPredicao(false)
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  const avisoDeErro = erro && (
    <Box display="flex" flexDirection="column" alignItems="center" my={5} p={5}
      style={{ backgroundColor: 'rgba(160, 0, 0, 0.8)', borderRadius: 8 }}>
      <Text fontSize={16} color="textColor" mb={3}>{erro}</Text>
      <Button height={35} onClick={tentarNovamente}>Try again</Button>
    </Box>
  )

  if (!targetComposition) {
    return (
      <Box display="flex" flex={1} flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
        {erro ? avisoDeErro : (
          <Text fontWeight={3} fontSize={20} color="textColor">Preparing draft…</Text>
        )}
      </Box>
    )
  }

  return (
    <Box display="flex" flex={1} p={15} flexDirection="column">

      {/* Phase / turn banner */}
      <Box display="flex" justifyContent="center" alignItems="baseline" mb={5} flexDirection="column" style={{ textAlign: 'center' }}>
        <Box display="flex" justifyContent="center" alignItems="baseline" width="100%">
          <Text fontWeight={3} fontSize={24} color="textColor">
            {getPhaseLabel(step)}
          </Text>
          {!isDraftComplete && (
            <Text fontSize={16} color="textColor" style={{ marginLeft: 12, opacity: 0.7 }}>
              {currentTeam === meuTime ? 'Your turn' : 'AI thinking…'}
            </Text>
          )}
        </Box>
      </Box>

      {avisoDeErro}

      <Box display="flex" flex={1}>

        {/* ── Blue side picks ── */}
        <Box display="flex" flex={1} justifyContent="flex-start">
          <Box mt={18} flexDirection="column">
            <Box mb={5}>
              <Text fontWeight={3} fontSize={18} color="textColor">
                Blue Side {meuTime === 'BLUE' ? '(Your team)' : '(AI team)'}
              </Text>
            </Box>
            {bluePicks.map((invocador, i) => (
              <CardBlueSide
                key={i}
                numero={i + 1}
                invocador={invocador || { campeao: null, rota: null }}
                ativo={currentBluePickSlot === i}
              >
                {meuTime === 'BLUE' && invocador?.campeao && (
                  <RoleSelect
                    style={{ marginTop: 6 }}
                    value={userRoles[i] || ''}
                    onChange={(e) => {
                      const role = e.target.value || null
                      setUserRoles(prev => { const next = [...prev]; next[i] = role; return next })
                    }}
                  >
                    <option value="">Role…</option>
                    {ROLE_OPTIONS.map(({ value, label }) => (
                      <option key={value} value={value} disabled={userRoles.includes(value) && userRoles[i] !== value}>
                        {label}
                      </option>
                    ))}
                  </RoleSelect>
                )}
              </CardBlueSide>
            ))}
            {meuTime === 'BLUE' && isDraftComplete && (
              <Box mt={10}>
                <Button disabled={!allRolesAssigned || loadingPredicao} onClick={handlePredict}>
                  {loadingPredicao ? 'Predicting…' : 'Predict Winner'}
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {/* ── Center: champion picker + ban rows ── */}
        <Box display="flex" flex={2} px={15} flexDirection="column">
          <PicksBans
            bloqueados={bloqueados}
            loading={loading}
            selecaoAtiva={!isDraftComplete && !isAITurn}
            onSelectCampeao={() => {}}
            onConfirm={(champion) => confirmarPasso(champion)}
          />

          {fearlessChampions.length > 0 && (
            <Box pt={5} display="flex" flexDirection="column" alignItems="center" style={{ borderTop: '1px solid #c9a227' }}>
              <Text mb={5} fontWeight={3} fontSize={14} color="textColor">Fearless</Text>
              <Box display="flex" flexWrap="wrap" justifyContent="center" width="100%">
                {fearlessChampions.map((campeao) => (
                  <Campeao key={campeao.id} m={5} nome={campeao.name} alias={campeao.alias} fontSizeNome={10} />
                ))}
              </Box>
            </Box>
          )}

          <Box pt={5} display="flex" flexDirection="column" alignItems="center" style={{ borderTop: '1px solid yellow' }}>
            <Text mb={5} fontWeight={3} fontSize={14} color="textColor">Bans</Text>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Box display="flex">
                {blueBans.map((campeao, i) => (
                  <CampeaoBanido key={i} ativo={currentBlueBanSlot === i} color="cyan" campeao={campeao} />
                ))}
              </Box>
              <Box display="flex">
                {redBans.map((campeao, i) => (
                  <CampeaoBanido key={i} ativo={currentRedBanSlot === i} color="red" campeao={campeao} />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ── Red side picks ── */}
        <Box display="flex" flex={1} justifyContent="flex-end">
          <Box mt={18} flexDirection="column">
            <Box mb={5} display="flex" justifyContent="flex-end">
              <Text fontWeight={3} fontSize={18} color="textColor">
                Red Side {meuTime === 'RED' ? '(Your team)' : '(AI team)'}
              </Text>
            </Box>
            {redPicks.map((invocador, i) => (
              <CardRedSide
                key={i}
                numero={i + 1}
                invocador={invocador || { campeao: null, rota: null }}
                ativo={currentRedPickSlot === i}
              >
                {meuTime === 'RED' && invocador?.campeao && (
                  <RoleSelect
                    style={{ marginTop: 6 }}
                    value={userRoles[i] || ''}
                    onChange={(e) => {
                      const role = e.target.value || null
                      setUserRoles(prev => { const next = [...prev]; next[i] = role; return next })
                    }}
                  >
                    <option value="">Role…</option>
                    {ROLE_OPTIONS.map(({ value, label }) => (
                      <option key={value} value={value} disabled={userRoles.includes(value) && userRoles[i] !== value}>
                        {label}
                      </option>
                    ))}
                  </RoleSelect>
                )}
              </CardRedSide>
            ))}
            {meuTime === 'RED' && isDraftComplete && (
              <Box mt={10} display="flex" justifyContent="flex-end">
                <Button disabled={!allRolesAssigned || loadingPredicao} onClick={handlePredict}>
                  {loadingPredicao ? 'Predicting…' : 'Predict Winner'}
                </Button>
              </Box>
            )}
          </Box>
        </Box>

      </Box>

      {/* ── Prediction result ── */}
      {predicao && (
        <Box pt={5} mt={5} display="flex" alignItems="center" flexDirection="column" style={{ borderTop: '1px solid yellow' }}>
          <Text mb={3} fontWeight={3} fontSize={18} color="textColor">
            <span role="img" aria-label="robot">🤖</span>
            {' '}{predicao.predicted_winner} team is the predicted winner
            {' '}({Math.round(predicao.win_probability * 100)}%)
          </Text>
          {predicao.confidence && (
            <Text mb={3} fontSize={14} color="textColor" style={{ opacity: 0.8 }}>
              Confidence: {CONFIDENCE_LABELS[predicao.confidence] || predicao.confidence}
            </Text>
          )}
          {(predicao.key_factors || []).map((f) => (
            <Text key={f.factor} fontSize={14} color="textColor" style={{ opacity: 0.8 }}>
              • {f.label}
            </Text>
          ))}
          <Box mt={5} />
          <Button onClick={() => history.push('/')}>Try again</Button>
        </Box>
      )}

    </Box>
  )
})
