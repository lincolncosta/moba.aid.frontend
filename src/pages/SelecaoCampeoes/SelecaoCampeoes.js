import React, { Suspense, memo, useState } from 'react'

// import { useQuery } from 'react-query'

import { Campeao } from 'components/Campeao'
import { CardBlueSide } from 'components/CardBlueSide'
import { CardRedSide } from 'components/CardRedSide'
import { Box } from 'components/Box'
import { Text } from 'components/Text'
import { Loading } from 'components/Loading'
import { PicksBans } from 'components/PicksBans'

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
  const [round, setRound] = useState(0)
  const [blueSide, setBlueSide] = useState(blue)
  const [redSide, setRedSide] = useState(red)
  const [timeSelecionando, setTimeSelecionando] = useState('BLUE')

  // TODO: Alterar por opção selecionada na tela anterior
  const meuTime = 'RED'

  const confirmaSelecaoCampeao = () => {
    if (round < 10) {
      const proximoTime = [0, 3, 4, 7, 8].includes(round + 1) ? 'BLUE' : 'RED'

      setTimeSelecionando(proximoTime)
      setRound(round + 1)
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
          selecaoRotasAtiva={meuTime === timeSelecionando}
          onSelectCampeao={selecionaCampeao}
          onSelectRota={selecionaRota}
          onConfirm={confirmaSelecaoCampeao}
        />

        <Suspense
          fallback={
            <Box alignItems="center" justifyContent="center" display="flex" flex={1}>
              <Loading height={60} width={60} />
            </Box>
          }
        >
          <Box
            pt={5}
            display="flex"
            alignItems="center"
            flexDirection="column"
            style={{ borderTop: '1px solid yellow' }}
          >
            <Text mb={5} fontWeight={3} fontSize={18} color="textColor">
              Sugestão
            </Text>
            <Campeao nome="Yorick" alias="Yorick" fontSizeNome={20} />
          </Box>
        </Suspense>
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
