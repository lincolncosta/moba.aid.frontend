import React, { memo, useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { getSugestao } from 'api/sugestao'

import { Box } from 'components/Box'
import { Text } from 'components/Text'
import { PicksBans } from 'components/PicksBans'
import { Button } from 'components/Button'
import { CampeaoBanido } from 'components/CampeaoBanido'
import campeoesDataset from '../../database/champions.json'

const bansArray = Array.from({ length: 10 }, (_, i) => ({ round: i, campeao: null }))

export const Banimentos = memo(() => {
  const history = useHistory()
  const [round, setRound] = useState(0)
  const [bans, setBans] = useState(bansArray)
  const [bloqueados, setBloqueados] = useState([])
  const [loading, setLoading] = useState(false)
  const time = history.location.state.meuTime
  const patch = '15.08'

  const selecionaCampeao = useCallback((campeaoSelecionado) => {
    setBans((prevBans) => {
      const novosBans = [...prevBans]
      const posicao = round
      if (posicao >= 0 && posicao < novosBans.length) {
        novosBans[posicao] = {
          ...novosBans[posicao],
          campeao: campeaoSelecionado
        }
      }

      return novosBans
    })
  }, [round])

  const confirmaSelecaoCampeao = useCallback(() => {
    setBloqueados(() =>
      bans.map((b) => b.campeao).filter(Boolean)
    )

    setRound((prevRound) => {
      const updated = prevRound + 1
      return updated
    })
  }, [bans])

  const terminarBans = () => {
    history.push({
      pathname: '/picks',
      state: { bloqueados: bans.map(obj => obj.campeao).filter(Boolean), meuTime: time }
    })
  }

  const buscarBanimentoDoAlgoritmo = useCallback(async () => {
    setLoading(true)

    const campeoesBanidos = bans.map((b) => b.campeao).filter(Boolean).map(c => c.name)

    const sugestoes = await getSugestao({
      patch,
      objective: 'BAN',
      numChampions: 1,
      selectedChampions: [],
      bannedChampions: campeoesBanidos,
      enemyChampions: []
    })
    const campeaoSugerido = sugestoes.suggestions[0]
    const campeao = campeoesDataset.find((c) => c.name === campeaoSugerido.champion)
    selecionaCampeao(campeao)
    confirmaSelecaoCampeao()
    setLoading(false)
  }, [bans, patch, selecionaCampeao, confirmaSelecaoCampeao])

  useEffect(() => {
    const tecnicoRounds = time === 'BLUE'
      ? [0, 2, 4, 6, 8]
      : [1, 3, 5, 7, 9]

    if (!tecnicoRounds.includes(round) && round < 10 && !bans[round]?.campeao && !loading) {
      buscarBanimentoDoAlgoritmo()
    }
  }, [round, time, bans, buscarBanimentoDoAlgoritmo, loading])

  const isTurnoDoTecnico = (time === 'BLUE' && [0, 2, 4, 6, 8].includes(round)) ||
    (time === 'RED' && [1, 3, 5, 7, 9].includes(round))

  return (
    <Box display="flex" flex={1} flexDirection="column" alignItems="center">
      <Box mb={10} display="flex" flex={1} alignItems="center">
        <Text fontWeight={3} fontSize={40} color="textColor">
          Bans
        </Text>
      </Box>

      <PicksBans
        alignItems="center"
        width="50%"
        bloqueados={bloqueados}
        loading={loading}
        selecaoAtiva={round < 10 && isTurnoDoTecnico}
        onSelectCampeao={selecionaCampeao}
        onConfirm={confirmaSelecaoCampeao}
      />

      <Box mt={10} display="flex" flex={1}>
        <Box mr={20} display="flex">
          {[0, 2, 4, 6, 8].map((r, i) => (
            <CampeaoBanido key={r} ativo={round === r} color="cyan" campeao={bans[r]?.campeao} />
          ))}
        </Box>
        <Box display="flex">
          {[1, 3, 5, 7, 9].map((r, i) => (
            <CampeaoBanido key={r} ativo={round === r} color="red" campeao={bans[r]?.campeao} />
          ))}
        </Box>
      </Box>

      <Box>{ bans?.length }</Box>
      <Box mt={10} mb={10} display="flex" justifyContent="center">
        <Button disabled={bans.length !== 10} onClick={terminarBans}>
          Next step
        </Button>
      </Box>
    </Box>
  )
})
