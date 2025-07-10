import React, { memo, useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { getSugestao } from 'api/sugestao'

import { CardBlueSide } from 'components/CardBlueSide'
import { CardRedSide } from 'components/CardRedSide'
import { Box } from 'components/Box'
import { Text } from 'components/Text'
import { PicksBans } from 'components/PicksBans'
import campeoesDataset from '../../database/champions.json'
import { Campeao } from 'components/Campeao'
import { getPredicao } from 'api/predicao'
import { Button } from 'components/Button'

const blue = [
  { round: 0, rota: null, campeao: null },
  { round: 3, rota: null, campeao: null },
  { round: 4, rota: null, campeao: null },
  { round: 7, rota: null, campeao: null },
  { round: 8, rota: null, campeao: null }
]

const red = [
  { round: 1, rota: null, campeao: null },
  { round: 2, rota: null, campeao: null },
  { round: 5, rota: null, campeao: null },
  { round: 6, rota: null, campeao: null },
  { round: 9, rota: null, campeao: null }
]

export const SelecaoCampeoes = memo(() => {
  const history = useHistory()

  // const [isLoading, setIsLoading] = useState(false)
  const [round, setRound] = useState(0)
  const [terminouDraft, setTerminouDraft] = useState(false)
  const [predicao, setPredicao] = useState(null)
  const [blueSide, setBlueSide] = useState(blue)
  const [redSide, setRedSide] = useState(red)
  const [timeSelecionando, setTimeSelecionando] = useState('BLUE')
  const [campeoesBanidos] = useState(history.location.state.bloqueados)
  const [bloqueados, setBloqueados] = useState(history.location.state.bloqueados)
  const [solicitacaoPendente, setSolicitacaoPendente] = useState(false)
  const meuTime = history.location.state.meuTime
  const [params, setParams] = useState({
    enemyChampions: [],
    bannedChampions: [],
    selectedChampions: {},
    selectedRoles: [],
    patch: '15.08',
    objective: 'PICK'
  })

  const selecionaCampeao = useCallback((campeaoSelecionado) => {
    setBlueSide((prevBlueSide) => {
      if (timeSelecionando === 'BLUE') {
        const newBlueSide = [...prevBlueSide]
        const posicao = newBlueSide.findIndex((p) => p.round === round)
        newBlueSide[posicao].campeao = campeaoSelecionado
        return newBlueSide
      }
      return prevBlueSide
    })

    setRedSide((prevRedSide) => {
      if (timeSelecionando === 'RED') {
        const newRedSide = [...prevRedSide]
        const posicao = newRedSide.findIndex((p) => p.round === round)
        newRedSide[posicao].campeao = campeaoSelecionado
        return newRedSide
      }
      return prevRedSide
    })
  }, [timeSelecionando, round])

  const atualizaCampeoesBloqueados = useCallback(() => {
    setBloqueados((prevBloqueados) => {
      const campeoesRedSide = redSide.map((c) => c.campeao).filter(Boolean)
      const campeoesBlueSide = blueSide.map((c) => c.campeao).filter(Boolean)
      return [...prevBloqueados, ...campeoesBlueSide, ...campeoesRedSide]
    })
  }, [blueSide, redSide])

  const atualizaTimeGA = useCallback((nomeCampeao, role) => {
    setParams((prevParams) => ({
      ...prevParams,
      selectedChampions: {
        ...prevParams.selectedChampions,
        [role]: nomeCampeao
      },
      selectedRoles: prevParams.selectedRoles.includes(role)
        ? prevParams.selectedRoles
        : [...prevParams.selectedRoles, role]
    }))
  }, [])

  const confirmaSelecaoCampeao = useCallback(() => {
    if (round < 10) {
      const proximoTime = [0, 3, 4, 7, 8].includes(round + 1) ? 'BLUE' : 'RED'

      setTimeSelecionando(proximoTime)
      setRound((prevRound) => prevRound + 1) // Atualiza corretamente o estado
      atualizaCampeoesBloqueados()
      setSolicitacaoPendente(false)
    }

    if ([...red, ...blue].every(obj => obj.campeao && obj.campeao.id)) {
      setTerminouDraft(true)
    }
  }, [round, atualizaCampeoesBloqueados])

  const buscaCampeoesSugeridos = useCallback(async (numChampions) => {
    if (solicitacaoPendente) return // Evita chamadas duplas

    setSolicitacaoPendente(true) // Marca como "requisição em andamento"

    const updatedParams = { ...params } // Fazendo uma cópia para evitar mutações indesejadas
    updatedParams.numChampions = numChampions
    updatedParams.bannedChampions = bloqueados.map((champion) => champion.name)
    setParams(updatedParams)

    if (meuTime === 'RED') {
      updatedParams.enemyChampions = redSide.filter((c) => c.campeao).map((c) => c.campeao.name)
    } else {
      updatedParams.enemyChampions = blueSide.filter((c) => c.campeao).map((c) => c.campeao.name)
    }

    const campeaoSugerido = await getSugestao(updatedParams)
    const campeao = campeoesDataset.find((c) => c.name === campeaoSugerido.suggestions[0].champion)
    selecionaCampeao(campeao)
    atualizaTimeGA(campeaoSugerido.suggestions[0].champion, campeaoSugerido.suggestions[0].role)
    confirmaSelecaoCampeao()
  }, [bloqueados, blueSide, redSide, meuTime, solicitacaoPendente, params, selecionaCampeao, confirmaSelecaoCampeao, atualizaTimeGA])

  useEffect(() => {
    const proximoTime = [0, 3, 4, 7, 8].includes(round) ? 'BLUE' : 'RED'

    if (proximoTime !== meuTime && !solicitacaoPendente && !terminouDraft) {
      buscaCampeoesSugeridos(1)
    }
  }, [round, buscaCampeoesSugeridos, meuTime, solicitacaoPendente, terminouDraft])

  useEffect(() => {
    const fetchPredicao = async () => {
      if (terminouDraft) {
        const predicao = await getPredicao(paramsPredicao);
        setPredicao(predicao);
      }
    };

    console.log(params)
    console.log(meuTime)
    const timeInimigo = meuTime === "BLUE" ? "red" : "blue";
    let paramsPredicao = {};

    Object.entries(params.selectedChampions).forEach(([role, champion]) => {
      paramsPredicao[`${role}_${timeInimigo}`] = champion;
    });
    paramsPredicao = {
      "top_red": "Rumble",
      "jng_red": "Nocturne",
      "mid_red": "Taliyah",
      "bot_red": "Ashe",
      "sup_red": "Braum"
    };

    fetchPredicao();
  }, [terminouDraft, params, meuTime]);

  return (
    <Box display="flex" flex={1} p={15}>
      <Box display="flex" flex={1} justifyContent="flex-start">
        <Box mt={18} flexDirection="column">
          <Box mb={5} display="flex">
            <Text mb={5} fontWeight={3} fontSize={18} color="textColor">
              Blue Side {meuTime === 'BLUE' ? `(Your team)` : `(AI team)`}
            </Text>
          </Box>
          <CardBlueSide id={0} ativo={round === 0} numero={1} invocador={blueSide[0]} />
          <CardBlueSide id={1} ativo={round === 3} numero={2} invocador={blueSide[1]} />
          <CardBlueSide id={2} ativo={round === 4} numero={3} invocador={blueSide[2]} />
          <CardBlueSide id={3} ativo={round === 7} numero={4} invocador={blueSide[3]} />
          <CardBlueSide id={4} ativo={round === 8} numero={5} invocador={blueSide[4]} />
        </Box>
      </Box>

      <Box display="flex" flex={2} px={15} flexDirection="column">
        <PicksBans
          selecaoRotas
          bloqueados={bloqueados}
          selecaoAtiva={round < 10}
          selecaoRotasAtiva={meuTime === timeSelecionando}
          onSelectCampeao={selecionaCampeao}
          onConfirm={confirmaSelecaoCampeao}
        />

        {!terminouDraft && (
          <Box pt={5} display="flex" alignItems="center" flexDirection="column" style={{ borderTop: '1px solid yellow' }}>
            <Text mb={5} fontWeight={3} fontSize={18} color="textColor">
              Champions banned
            </Text>
            <Box display="flex" justifyContent="space-around">
              {campeoesBanidos?.map((campeao) => {
                if (campeao.id === -1) return null

                return (
                  <Campeao
                    m={5}
                    key={campeao.id}
                    nome={campeao.name}
                    alias={campeao.alias}
                    bloqueado={true}
                    selecionado={false}
                  />
                )
              })}
            </Box>
          </Box>
        )}

        {terminouDraft && (
          <Box pt={5} display="flex" alignItems="center" flexDirection="column" style={{ borderTop: '1px solid yellow' }}>
            <Text mb={5} fontWeight={3} fontSize={18} color="textColor">
              <span role='img' aria-label='robot emoji'>🤖</span>{predicao?.predicted_winner} team is the predicted winner
            </Text>
            <Box display="flex" justifyContent="space-around" color="textColor">
              <a href='/'>
                <Button>
                  Try again
                </Button>
              </a>
            </Box>
          </Box>
        )}
      </Box>

      <Box display="flex" flex={1} justifyContent="flex-end">
        <Box mt={18} flexDirection="column">
          <Box mb={5} display="flex" justifyContent="flex-end">
            <Text fontWeight={3} fontSize={18} color="textColor">
              Red Side  {meuTime === 'BLUE' ? `(AI team)` : `(Your team)`}
            </Text>
          </Box>
          <CardRedSide id={5} ativo={round === 1} numero={1} invocador={redSide[0]} />
          <CardRedSide id={6} ativo={round === 2} numero={2} invocador={redSide[1]} />
          <CardRedSide id={7} ativo={round === 5} numero={3} invocador={redSide[2]} />
          <CardRedSide id={8} ativo={round === 6} numero={4} invocador={redSide[3]} />
          <CardRedSide id={9} ativo={round === 9} numero={5} invocador={redSide[4]} />
        </Box>
      </Box>


    </Box>
  )
})
