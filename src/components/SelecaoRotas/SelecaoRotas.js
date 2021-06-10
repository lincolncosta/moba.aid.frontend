import React from 'react'
import styled, { css } from 'styled-components'

import { Box } from '../Box'
import { Text } from '../Text'

import topo from 'assets/rotas/topo.png'
import cacador from 'assets/rotas/cacador.png'
import meio from 'assets/rotas/meio.png'
import atirador from 'assets/rotas/atirador.png'
import suporte from 'assets/rotas/suporte.png'

const SelecaoRotasStyled = styled(Box)`
  height: 100px;
  display: flex;
  flex-direction: column;
  flex: 1;

  padding-bottom: 10px;

  cursor: pointer;
`

const RotaStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${(props) =>
    props.selecionado &&
    css`
      box-shadow: 0 4px 2px -2px gold;
    `}
`

const RotaImage = styled(Box)`
  background-image: url(${(props) => props.img});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  height: 30px;
  width: 30px;
`

export const SelecaoRotas = ({ selecaoRotasAtiva, rotaSelecionada, onSelect, ...props }) => {
  const rotas = [
    { label: 'Topo', img: topo },
    { label: 'Caçador', img: cacador },
    { label: 'Meio', img: meio },
    { label: 'Atirador', img: atirador },
    { label: 'Suporte', img: suporte }
  ]

  return (
    <SelecaoRotasStyled {...props}>
      {selecaoRotasAtiva && (
        <>
          <Text mb={10} fontWeight={3} fontSize={15} color="textColor" textAlign="center">
            Selecione a rota correspondente
          </Text>
          <Box display="flex" flex={1} justifyContent="space-around">
            {rotas.map((rota) => (
              <RotaStyled selecionado={rota.label === rotaSelecionada} onClick={() => onSelect(rota.label)}>
                <RotaImage img={rota.img} mb={3} />
                <Text textAlign="center" fontWeight={2} fontSize={12} color="textColor">
                  {rota.label}
                </Text>
              </RotaStyled>
            ))}
          </Box>
        </>
      )}
    </SelecaoRotasStyled>
  )
}
