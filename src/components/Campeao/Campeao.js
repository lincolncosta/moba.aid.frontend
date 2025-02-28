import React from 'react'
import styled, { css } from 'styled-components'

import { Box } from '../Box'
import { Text } from '../Text'

import topo from 'assets/rotas/topo.png'
import cacador from 'assets/rotas/cacador.png'
import meio from 'assets/rotas/meio.png'
import atirador from 'assets/rotas/atirador.png'
import suporte from 'assets/rotas/suporte.png'

const CampeaoStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 85px;
`

const CampeaoImage = styled(Box)`
  position: relative;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  cursor: pointer;

  height: 75px;
  width: 75px;

  ${(props) =>
    props.selecionado &&
    css`
      box-shadow: 0 0 15px gold;
    `}

  ${(props) =>
    props.bloqueado &&
    css`
      & {
        cursor: auto;
      }

      &:after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.6);
      }
    `}
`

const RotaImage = styled(Box)`
  background-image: url(${(props) => props.img});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  height: 20px;
  width: 20px;
`

export const Campeao = ({ nome, alias, fontSizeNome, selecionado, rota, bloqueado, ...props }) => {
  const rotas = {
    top: topo,
    jungle: cacador,
    mid: meio,
    adc: atirador,
    support: suporte
  }

  const img = `http://ddragon.leagueoflegends.com/cdn/${process.env.REACT_APP_LAST_PATCH}/img/champion/${alias}.png`

  return (
    <CampeaoStyled {...props}>
      <CampeaoImage selecionado={selecionado} bloqueado={bloqueado} style={{ backgroundImage: `url(${img})` }} mb={3} />
      <Box display="flex" alignItems="center">
        {rota && <RotaImage img={rotas[rota]} mr={3} />}
        <Text textAlign="center" fontSize={fontSizeNome || 12} color="textColor">
          {nome}
        </Text>
      </Box>
    </CampeaoStyled>
  )
}
