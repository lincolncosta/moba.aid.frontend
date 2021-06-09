import React, { Suspense, memo, useState } from 'react'

// import { useQuery } from 'react-query'

import { Campeao } from 'components/Campeao'
import { CardBlueSide } from 'components/CardBlueSide'
import { CardRedSide } from 'components/CardRedSide'
import { Box } from 'components/Box'
import { Text } from 'components/Text'
import { Loading } from 'components/Loading'
import { PicksBans } from 'components/PicksBans'

export const SelecaoCampeoes = memo(() => {
  const [selecaoAtiva, setSelecaoAtiva] = useState(false)

  const players = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]

  const confirmaSelecaoCampeao = (campeao) => {
    if (!campeao) return

    alert(`Selecionado: ${campeao.name}`)
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
          {players.map((player) => (
            <CardBlueSide key={player.id} numero={player.id} onClick={() => setSelecaoAtiva(!selecaoAtiva)} />
          ))}
        </Box>
      </Box>

      <Box display="flex" flex={2} px={15} flexDirection="column">
        <Box display="flex" alignItems="center" flexDirection="column">
          <Text mb={5} fontWeight={3} fontSize={18} color="textColor">
            Invocador 1 está escolhendo.
          </Text>
          <Text mb={15} fontWeight={3} fontSize={40} color="textColor">
            3
          </Text>
        </Box>

        <PicksBans selecaoAtiva={selecaoAtiva} onConfirm={confirmaSelecaoCampeao} />

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
          {players.map((player) => (
            <CardRedSide key={player.id} numero={player.id} onClick={() => setSelecaoAtiva(!selecaoAtiva)} />
          ))}
        </Box>
      </Box>
    </Box>
  )
})
