import React, { memo, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { getTimes } from 'api/times'
import { Box } from 'components/Box'
import { Text } from 'components/Text'
import { Button } from 'components/Button'
import { Scout } from 'components/Scout'
import { Panel, PanelTitle, Muted, Row, Select, ROLES, ROLE_LABELS } from 'components/Panel'

const vazio = { team: '', players: { top: '', jng: '', mid: '', bot: '', sup: '' } }

// Escolha dos times e dos jogadores dos dois lados. O elenco mais recente vem
// preenchido e pode ser trocado rota a rota. Sem time, a força conta como neutra.
const EscolhaTime = ({ titulo, cor, valor, onChange, dados, ligas }) => {
  const [liga, setLiga] = useState('')
  const times = dados.teams.filter((t) => !liga || t.league === liga)
  const porRota = useMemo(() => {
    const out = {}
    ROLES.forEach((r) => { out[r] = dados.players.filter((p) => p.role === r) })
    return out
  }, [dados])

  const escolherTime = (id) => {
    const t = dados.teams.find((x) => x.id === id)
    if (!t) { onChange(vazio); return }
    const players = {}
    ROLES.forEach((r) => { players[r] = t.lineup[r]?.id || '' })
    onChange({ team: id, players })
  }

  return (
    <Panel style={{ borderColor: cor, flex: 1, minWidth: 300 }}>
      <PanelTitle style={{ color: cor }}>{titulo}</PanelTitle>
      <Row>
        <Select value={liga} onChange={(e) => setLiga(e.target.value)}>
          <option value="">All leagues</option>
          {ligas.map((l) => <option key={l} value={l}>{l}</option>)}
        </Select>
        <Select value={valor.team} onChange={(e) => escolherTime(e.target.value)} style={{ flex: 1 }}>
          <option value="">No team (champions only)</option>
          {times.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.league})</option>)}
        </Select>
      </Row>
      {ROLES.map((r) => (
        <Row key={r}>
          <span style={{ minWidth: 70 }}>{ROLE_LABELS[r]}</span>
          <Select
            style={{ flex: 1 }}
            value={valor.players[r] || ''}
            onChange={(e) => onChange({ ...valor, players: { ...valor.players, [r]: e.target.value } })}
          >
            <option value="">—</option>
            {porRota[r].map((p) => (
              <option key={p.id} value={p.id}>{p.name}{p.team_name ? ` · ${p.team_name}` : ''}</option>
            ))}
          </Select>
        </Row>
      ))}
    </Panel>
  )
}

export const Teams = memo(() => {
  const history = useHistory()
  const meuTime = history.location.state?.meuTime
  const fearless = history.location.state?.fearless || []
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState(null)
  const [meu, setMeu] = useState(vazio)
  const [adv, setAdv] = useState(vazio)

  useEffect(() => { if (!meuTime) history.replace('/') }, [meuTime, history])
  useEffect(() => {
    getTimes().then(setDados).catch((err) => setErro(err?.response?.data?.error || err.message))
  }, [])

  const ligas = useMemo(() => (dados ? [...new Set(dados.teams.map((t) => t.league))].sort() : []), [dados])

  const limpar = (s) => ({
    team: s.team || null,
    players: Object.fromEntries(Object.entries(s.players).filter(([, v]) => v)),
  })

  const avancar = (comTimes) => {
    const ours = comTimes ? limpar(meu) : { team: null, players: {} }
    const theirs = comTimes ? limpar(adv) : { team: null, players: {} }
    const lados = meuTime === 'BLUE' ? { blue: ours, red: theirs } : { blue: theirs, red: ours }
    history.push({ pathname: '/draft', state: { meuTime, fearless, lados } })
  }

  const corMeu = meuTime === 'BLUE' ? '#1E90FF' : '#FF4500'
  const corAdv = meuTime === 'BLUE' ? '#FF4500' : '#1E90FF'

  return (
    <Box display="flex" flex={1} p={15} flexDirection="column" alignItems="center">
      <Text fontWeight={3} fontSize={32} color="textColor" mb={3}>Teams and players</Text>
      <Text fontSize={15} color="textColor" mb={8} style={{ opacity: 0.8, textAlign: 'center', maxWidth: 820 }}>
        Pick your team and the opponent. The latest lineup is filled in and you can change any player.
        Teams and players drive most of the prediction; the draft moves it by a few points.
      </Text>
      {erro && <Panel style={{ marginBottom: 10 }}>Could not load teams: {erro}</Panel>}
      {!dados && !erro && <Text color="textColor">Loading teams…</Text>}
      {dados && (
        <>
          <Muted style={{ color: 'white', marginBottom: 8 }}>
            Data up to {dados.model.last_date} (patch {dados.model.patch}, {dados.model.n_matches} professional games).
          </Muted>
          <Box display="flex" width="100%" style={{ maxWidth: 1000, gap: 12, flexWrap: 'wrap' }}>
            <EscolhaTime titulo={`Your team (${meuTime === 'BLUE' ? 'blue' : 'red'} side)`} cor={corMeu} valor={meu} onChange={setMeu} dados={dados} ligas={ligas} />
            <EscolhaTime titulo="Opponent" cor={corAdv} valor={adv} onChange={setAdv} dados={dados} ligas={ligas} />
          </Box>
          {adv.team && (
            <Box width="100%" mt={6} style={{ maxWidth: 1000 }}>
              <Scout team={adv.team} opponent={meu.team || null} players={limpar(adv).players} title="Preparation" />
            </Box>
          )}
        </>
      )}
      <Box display="flex" justifyContent="center" mt={8} style={{ gap: 12 }}>
        <Button onClick={() => avancar(false)}>Skip (champions only)</Button>
        <Button disabled={!dados} onClick={() => avancar(true)}>Start draft</Button>
      </Box>
    </Box>
  )
})
