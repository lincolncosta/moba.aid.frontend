import React, { memo, useState } from 'react'

import { useHistory } from 'react-router-dom'

import { Box } from 'components/Box'
import { Text } from 'components/Text'
import { PicksBans } from 'components/PicksBans'
import { Button } from 'components/Button'
import { CampeaoBanido } from 'components/CampeaoBanido'

const bansArray = [
  { round: 0, campeao: null },
  { round: 1, campeao: null },
  { round: 2, campeao: null },
  { round: 3, campeao: null },
  { round: 4, campeao: null },
  { round: 5, campeao: null },
  { round: 6, campeao: null },
  { round: 7, campeao: null },
  { round: 8, campeao: null },
  { round: 9, campeao: null }
]

export const Banimentos = memo(() => {
  const history = useHistory()

  const [round, setRound] = useState(0)
  const [bans, setBans] = useState(bansArray)
  const [bloqueados, setBloqueados] = useState([])
  const [time, setTime] = useState([])

  const confirmaSelecaoCampeao = () => {
    if (round < 10) {
      setRound(round + 1)

      setBloqueados(bans.map((b) => b.campeao).filter((c) => c))
    }
  }

  const selecionaCampeao = (campeaoSelecionado) => {
    const posicao = bans.findIndex((p) => p.round === round)

    bans[posicao].campeao = campeaoSelecionado

    setBans([...bans])
  }

  const terminarBans = () => {
    console.log(time)
    history.push({
      pathname: '/picks',
      state: { bloqueados: bloqueados, meuTime: time }
    })
  }

  const handleSelectTime = (e) => {
    setTime(e.target.value)
  }

  return (
    <Box display="flex" flex={1} flexDirection="column" alignItems="center">
      <Box mb={10} display="flex" flex={1} alignItems="center">
        <Text fontWeight={3} fontSize={40} color="textColor">
          Informe os banimentos de ambos os times
        </Text>
      </Box>

      <PicksBans
        alignItems="center"
        width="50%"
        bloqueados={bloqueados}
        selecaoAtiva={round < 10}
        onSelectCampeao={round < 10 ? selecionaCampeao : () => {}}
        onConfirm={confirmaSelecaoCampeao}
      />

      <Box mt={10} display="flex" flex={1}>
        <Box mr={20} display="flex">
          <CampeaoBanido ativo={round === 0} color="cyan" campeao={bans[0]?.campeao} />
          <CampeaoBanido ativo={round === 1} color="cyan" campeao={bans[1]?.campeao} />
          <CampeaoBanido ativo={round === 2} color="cyan" campeao={bans[2]?.campeao} />
          <CampeaoBanido ativo={round === 3} color="cyan" campeao={bans[3]?.campeao} />
          <CampeaoBanido ativo={round === 4} color="cyan" campeao={bans[4]?.campeao} />
        </Box>
        <Box display="flex">
          <CampeaoBanido ativo={round === 5} color="red" campeao={bans[5]?.campeao} />
          <CampeaoBanido ativo={round === 6} color="red" campeao={bans[6]?.campeao} />
          <CampeaoBanido ativo={round === 7} color="red" campeao={bans[7]?.campeao} />
          <CampeaoBanido ativo={round === 8} color="red" campeao={bans[8]?.campeao} />
          <CampeaoBanido ativo={round === 9} color="red" campeao={bans[9]?.campeao} />
        </Box>
      </Box>

      <Text fontWeight={3} fontSize={40} color="textColor">
        Informe de qual lado você está jogando
      </Text>

      <div className="radio">
        <label>
          <input type="radio" value="BLUE" onChange={handleSelectTime} />
          <Text fontWeight={2} fontSize={15} color="textColor">
            Time azul
          </Text>
        </label>
      </div>
      <div className="radio">
        <label>
          <input type="radio" value="RED" onChange={handleSelectTime} />
          <Text fontWeight={2} fontSize={15} color="textColor">
            Time vermelho
          </Text>
        </label>
      </div>

      <Box mt={10} display="flex" justifyContent="center">
        <Button disabled={!bans[9].campeao} onClick={() => terminarBans()}>
          Terminar banimentos
        </Button>
      </Box>
    </Box>
  )
})
