import React from 'react'
import styled from 'styled-components'

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
  cursor: pointer;

  & + & {
    margin-top: 10px;
  }
`

export const CardBlueSide = ({ numero, ...props }) => {
  return (
    <Card py={10} pr={10} {...props}>
      <Image mr={10} height={60} width={60} borderRadius={30} img={icon}></Image>

      <Box display="flex" flexDirection="column" justifyContent="center" flex={1}>
        <Text fontWeight={2} color="white" fontSize={22}>
          {`Invocador ${numero}`}
        </Text>
        <Text mt={3} color="white" fontSize={15}>
          Fulano
        </Text>
      </Box>
    </Card>
  )
}
