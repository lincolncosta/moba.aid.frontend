import React, { memo, useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { Box } from 'components/Box'
import { Text } from 'components/Text'
import { Button } from 'components/Button'
import { Campeao } from 'components/Campeao'
import { PicksBans } from 'components/PicksBans'

// Etapa Fearless, antes da escolha do lado: o usuário marca quantos campeões
// quiser (os já usados na série). Eles ficam fora do draft inteiro, para os
// dois times, e são enviados à API em /start e /suggest como `fearless`.
export const Fearless = memo(() => {
  const history = useHistory()
  const [selecionados, setSelecionados] = useState([])

  const handleToggle = useCallback((campeao) => {
    setSelecionados((prev) =>
      prev.some((c) => c.id === campeao.id)
        ? prev.filter((c) => c.id !== campeao.id)
        : [...prev, campeao]
    )
  }, [])

  const avancar = (fearless) => {
    history.push({ pathname: '/side', state: { fearless } })
  }

  return (
    <Box display="flex" flex={1} p={15} flexDirection="column" alignItems="center">
      <Text fontWeight={3} fontSize={32} color="textColor" mb={3}>
        Fearless
      </Text>
      <Text fontSize={16} color="textColor" mb={8} style={{ opacity: 0.8, textAlign: 'center' }}>
        Select every champion already played in this series. They will be unavailable to both teams.
        Skip if this is the first game.
      </Text>

      <Box width="100%" style={{ maxWidth: 900 }}>
        <PicksBans
          multiSelect
          selectedChampions={selecionados}
          onToggleCampeao={handleToggle}
          selecaoAtiva={false}
          onConfirm={() => {}}
        />
      </Box>

      <Box display="flex" flexWrap="wrap" justifyContent="center" mt={3} style={{ maxWidth: 900 }}>
        {selecionados.length === 0 ? (
          <Text fontSize={12} color="textColor" style={{ opacity: 0.6 }}>None selected</Text>
        ) : (
          selecionados.map((campeao) => (
            <Campeao key={campeao.id} m={5} nome={campeao.name} alias={campeao.alias} fontSizeNome={10} selecionado />
          ))
        )}
      </Box>

      <Box display="flex" justifyContent="center" mt={8} style={{ gap: 12 }}>
        <Button onClick={() => avancar([])}>Skip</Button>
        <Button disabled={selecionados.length === 0} onClick={() => avancar(selecionados)}>
          Confirm ({selecionados.length})
        </Button>
      </Box>
    </Box>
  )
})
