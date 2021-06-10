import React from 'react'
import styled, { css } from 'styled-components'

import { Box } from '../Box'
import { Text } from '../Text'

const CampeaoStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 85px;
  cursor: pointer;
`

const CampeaoImage = styled(Box)`
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  height: 75px;
  width: 75px;

  ${(props) =>
    props.selecionado &&
    css`
      box-shadow: 0 0 15px gold;
    `}
`

export const Campeao = ({ nome, alias, fontSizeNome, selecionado, ...props }) => {
  const img = `http://ddragon.leagueoflegends.com/cdn/11.10.1/img/champion/${alias}.png`

  return (
    <CampeaoStyled {...props}>
      <CampeaoImage selecionado={selecionado} style={{ backgroundImage: `url(${img})` }} mb={3} />
      <Text textAlign="center" fontSize={fontSizeNome || 12} color="textColor">
        {nome}
      </Text>
    </CampeaoStyled>
  )
}
