import React, { memo } from 'react'

import { useHistory } from 'react-router-dom'

import { Box } from 'components/Box'
import { Text } from 'components/Text'
import { Button } from 'components/Button'

export const Home = memo(() => {
  const history = useHistory()

  return (
    <Box display="flex" height="100vh" flexDirection="column">
      <Box display="flex" flex={1} alignItems="center" justifyContent="space-around" flexDirection="column">
        <Text mb={5} fontWeight={3} fontSize={50} color="textColor">
          Moba AID
        </Text>
        <Box display="flex" flexDirection="column">
          <Text mb={55} fontSize={20} color="textColor">
            MOBA Artificial Intelligence Draft (AID) is an approach using genetic algorithm to suggest League of Legends
            team compositions
          </Text>
          <Box display="flex" justifyContent="center">
            <Button onClick={() => history.push('/picks')}>Começar</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
})
