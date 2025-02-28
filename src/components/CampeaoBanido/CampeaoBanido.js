import React from 'react'
import styled, { css } from 'styled-components'

import { Box } from '../Box'

import ban from 'assets/ban.png'

const CampeaoStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 85px;
`

const CampeaoImage = styled(Box)`
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  box-sizing: border-box;

  height: 75px;
  width: 75px;

  border: 1px solid #ddd;

  ${(props) =>
    props.ativo &&
    css`
      border-top: 8px solid ${(props) => props.color};
    `}
`

const BanImage = styled(Box)`
  background-image: url(${ban});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  height: 20px;
  width: 20px;
`

export const CampeaoBanido = ({ campeao, ativo, color, ...props }) => {
  const img = `http://ddragon.leagueoflegends.com/cdn/${process.env.REACT_APP_LAST_PATCH}/img/champion/${campeao?.alias}.png`

  return (
    <CampeaoStyled {...props}>
      <CampeaoImage ativo={ativo} color={color} style={{ backgroundImage: `url(${img})` }} mb={3} />
      <BanImage />
    </CampeaoStyled>
  )
}
