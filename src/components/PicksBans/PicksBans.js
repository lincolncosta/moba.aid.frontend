import React, { useState } from 'react'

import { Box } from '../Box'
import { Campeao } from '../Campeao'
import { Button } from '../Button'

import campeoes from '../../database/champions.json'

export const PicksBans = ({ selecaoAtiva, onConfirm }) => {
  const [campeaoSelecionado, setCampeaoSelecionado] = useState(null)

  const campeoesOrdenados = campeoes.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))

  return (
    <Box>
      <Box
        display="flex"
        flexWrap="wrap"
        flex={1}
        justifyContent="center"
        style={{ height: 400, maxHeight: 400, overflowY: 'scroll' }}
      >
        {selecaoAtiva &&
          campeoesOrdenados.map((campeao) => {
            if (campeao.id === -1) return null

            return (
              <Campeao
                m={5}
                key={campeao.id}
                nome={campeao.name}
                alias={campeao.alias}
                onClick={() => setCampeaoSelecionado(campeao)}
              />
            )
          })}
      </Box>
      <Box height={60} display="flex" justifyContent="center" alignItems="center">
        {selecaoAtiva && (
          <Button height={35} disabled={!campeaoSelecionado} onClick={() => onConfirm(campeaoSelecionado)}>
            Confirmar
          </Button>
        )}
      </Box>
    </Box>
  )
}
