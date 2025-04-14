import React, { useState, useEffect } from 'react'

import { Box } from '../Box'
import { Button } from '../Button'
import { Campeao } from '../Campeao'

import campeoes from '../../database/champions.json'

export const PicksBans = ({
  bloqueados = [],
  selecaoAtiva,
  selecaoRotas,
  selecaoRotasAtiva,
  onSelectCampeao,
  onSelectRota,
  onConfirm,
  campeaoSelecionado: campeaoSelecionadoProp,
  confirmarAutomaticamente,
  ...props
}) => {
  const [campeaoSelecionadoLocal, setCampeaoSelecionadoLocal] = useState(null)
  const campeaoSelecionado = campeaoSelecionadoProp || campeaoSelecionadoLocal

  useEffect(() => {
    if (confirmarAutomaticamente && campeaoSelecionadoProp && onConfirm) {
      onConfirm(campeaoSelecionadoProp)
    }
  }, [campeaoSelecionadoProp, confirmarAutomaticamente, onConfirm])

  const campeoesOrdenados = campeoes.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))

  const handleSelectCampeao = (campeao) => {
    if (bloqueados.find((c) => c.id === campeao.id)) {
      return
    }

    onSelectCampeao(campeao)
    setCampeaoSelecionadoLocal(campeao)
  }

  const handleConfirmarCampeao = () => {
    onConfirm(campeaoSelecionado)
    setCampeaoSelecionadoLocal(null)
  }

  return (
    <Box {...props}>
      <Box
        display="flex"
        flexWrap="wrap"
        flex={1}
        justifyContent="center"
        style={{ height: 465, maxHeight: 465, overflowY: 'scroll', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      >
        {campeoesOrdenados.map((campeao) => {
          if (campeao.id === -1) return null

          return (
            <Campeao
              m={5}
              key={campeao.id}
              nome={campeao.name}
              alias={campeao.alias}
              bloqueado={bloqueados.find((c) => c.id === campeao.id)}
              selecionado={campeao.id === campeaoSelecionado?.id}
              onClick={() => handleSelectCampeao(campeao)}
            />
          )
        })}
      </Box>
      <Box height={60} display="flex" justifyContent="center" alignItems="center">
        {selecaoAtiva && (
          <Button
            height={35}
            disabled={!campeaoSelecionado}
            onClick={handleConfirmarCampeao}
          >
            Select champion
          </Button>
        )}
      </Box>
    </Box>
  )
}
