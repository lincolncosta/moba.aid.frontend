import React from 'react'
import styled, { css } from 'styled-components'

import icon from 'assets/icon.jpeg'

import { Box } from 'components/Box'
import { Text } from 'components/Text'

const Image = styled(Box)`
  background-image: url(${(props) => props.img});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
`

const Card = styled(Box)`
  display: flex;
  border-bottom: 1px solid yellow;
  padding-left: 18px;

  & + & {
    margin-top: 10px;
  }

  ${(props) =>
    props.ativo &&
    css`
      padding-left: 10px;
      border-left: 8px solid cyan;
    `}
`

export const CardBlueSide = ({ numero, invocador, ativo, ...props }) => {
  const campeaoImg = `http://ddragon.leagueoflegends.com/cdn/${process.env.REACT_APP_LAST_PATCH}/img/champion/${invocador.campeao?.alias}.png`

  return (
    <Card py={10} pr={10} ativo={ativo} {...props}>
      <Image mr={10} height={60} width={60} borderRadius={30} img={invocador.campeao ? campeaoImg : icon}></Image>

      <Box display="flex" flexDirection="column" justifyContent="center" flex={1}>
        {ativo && (
          <Text mb={3} color="white" fontSize={12}>
            Escolhendo...
          </Text>
        )}
        <Text fontWeight={2} color="white" fontSize={18}>
          {invocador.campeao && !ativo ? invocador.campeao.name : `Summoner ${numero}`}
        </Text>
        {invocador.rota && (
          <Text mt={3} color="white" fontSize={15}>
            {invocador.rota.label}
          </Text>
        )}
      </Box>
    </Card>
  )
}
