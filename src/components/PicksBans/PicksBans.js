import React, { useState } from 'react'

import { Box } from '../Box'
import { Button } from '../Button'
import { Campeao } from '../Campeao'
import { SelecaoRotas } from '../SelecaoRotas'

import campeoes from '../../database/champions.json'

export const PicksBans = ({ selecaoRotasAtiva, onSelectCampeao, onSelectRota, onConfirm }) => {
  const [campeaoSelecionado, setCampeaoSelecionado] = useState(null)
  const [rotaSelecionada, setRotaSelecionada] = useState(null)

  const campeoesOrdenados = campeoes.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))

  const handleSelectRota = (rota) => {
    onSelectRota(rota)
    setRotaSelecionada(rota)
  }

  const handleSelectCampeao = (campeao) => {
    onSelectCampeao(campeao, rotaSelecionada)
    setCampeaoSelecionado(campeao)
  }

  const handleConfirmarCampeao = () => {
    onConfirm(campeaoSelecionado)
    setCampeaoSelecionado(null)
    setRotaSelecionada(null)
  }

  return (
    <Box>
      <SelecaoRotas
        selecaoRotasAtiva={selecaoRotasAtiva}
        rotaSelecionada={rotaSelecionada}
        onSelect={(rota) => handleSelectRota(rota)}
      />

      <Box
        display="flex"
        flexWrap="wrap"
        flex={1}
        justifyContent="center"
        style={{ height: 375, maxHeight: 375, overflowY: 'scroll' }}
      >
        {campeoesOrdenados.map((campeao) => {
          if (campeao.id === -1) return null

          return (
            <Campeao
              m={5}
              key={campeao.id}
              nome={campeao.name}
              alias={campeao.alias}
              selecionado={campeao.id === campeaoSelecionado?.id}
              onClick={() => handleSelectCampeao(campeao)}
            />
          )
        })}
      </Box>
      <Box height={60} display="flex" justifyContent="center" alignItems="center">
        <Button
          height={35}
          disabled={selecaoRotasAtiva ? !campeaoSelecionado || !rotaSelecionada : !campeaoSelecionado}
          onClick={handleConfirmarCampeao}
        >
          Confirmar
        </Button>
      </Box>
    </Box>
  )
}
