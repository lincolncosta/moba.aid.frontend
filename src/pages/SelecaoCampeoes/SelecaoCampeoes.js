import React, { memo, useState } from 'react'

import { getSugestao } from 'api/sugestao'

import { CardBlueSide } from 'components/CardBlueSide'
import { CardRedSide } from 'components/CardRedSide'
import { Box } from 'components/Box'
import { Text } from 'components/Text'
import { PicksBans } from 'components/PicksBans'
import { Sugestao } from 'components/Sugestao'

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
  const [isLoading, setIsLoading] = useState(false)
  const [campeoesSugeridos, setCampeoesSugeridos] = useState([])
  const [round, setRound] = useState(0)
  const [blueSide, setBlueSide] = useState(blue)
  const [redSide, setRedSide] = useState(red)
  const [timeSelecionando, setTimeSelecionando] = useState('BLUE')
  const [bloqueados, setBloqueados] = useState([]) // TODO: Iniciar com os campeões banidos

  // TODO: Alterar por opção selecionada na tela anterior
  const meuTime = 'RED'

  const params = {
    NEEDED_RETURN_SIZE: 1,
    ENEMY_HEROES: [],
    BANNED_HEROES: [],
    PICKED_HEROES: {}
  }

  const buscaCampeoesSugeridos = () => {
    setIsLoading(true)

    // TODO: Tornar dinâmico após a seleção de times
    params.ENEMY_HEROES = blueSide.filter((c) => c.campeao).map((c) => c.campeao.id)

    redSide.filter((c) => c.campeao).map((c) => (params.PICKED_HEROES[c.rota.key] = c.campeao.id))

    return getSugestao(params)
      .then((data) => {
        const campeoes = Object.keys(data).map((rota) => (data[rota] ? { rota, campeao: data[rota] } : null))

        setCampeoesSugeridos(campeoes.filter((c) => c))
      })
      .finally(() => setIsLoading(false))
  }

  const confirmaSelecaoCampeao = () => {
    if (round < 10) {
      const proximoTime = [0, 3, 4, 7, 8].includes(round + 1) ? 'BLUE' : 'RED'

      setTimeSelecionando(proximoTime)
      setRound(round + 1)

      atualizaCampeoesBloqueados()

      if (proximoTime === meuTime) {
        buscaCampeoesSugeridos()
      } else {
        setCampeoesSugeridos([])
      }
    }
  }

  const selecionaCampeao = (campeaoSelecionado) => {
    const time = timeSelecionando === 'BLUE' ? blueSide : redSide
    const posicao = time.findIndex((p) => p.round === round)

    time[posicao].campeao = campeaoSelecionado

    timeSelecionando === 'BLUE' ? setBlueSide([...time]) : setRedSide([...time])
  }

  const selecionaRota = (rota) => {
    const time = timeSelecionando === 'BLUE' ? blueSide : redSide
    const posicao = time.findIndex((p) => p.round === round)

    time[posicao].rota = rota

    timeSelecionando === 'BLUE' ? setBlueSide([...time]) : setRedSide([...time])
  }

  const atualizaCampeoesBloqueados = () => {
    const campeoesRedSide = redSide.map((c) => c.campeao).filter((c) => c)
    const campeoesBlueSide = blueSide.map((c) => c.campeao).filter((c) => c)

    setBloqueados([...campeoesBlueSide, ...campeoesRedSide])
  }

  return (
    <Box display="flex" flex={1} p={15}>
      <Box display="flex" flex={1} justifyContent="flex-start">
        <Box mt={18} flexDirection="column">
          <Box mb={5} display="flex">
            <Text mb={5} fontWeight={3} fontSize={18} color="textColor">
              Blue Side
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
          onSelectRota={selecionaRota}
          onConfirm={confirmaSelecaoCampeao}
        />

        <Sugestao isLoading={isLoading} campeoesSugeridos={campeoesSugeridos} />
      </Box>

      <Box display="flex" flex={1} justifyContent="flex-end">
        <Box mt={18} flexDirection="column">
          <Box mb={5} display="flex" justifyContent="flex-end">
            <Text fontWeight={3} fontSize={18} color="textColor">
              Red Side
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
