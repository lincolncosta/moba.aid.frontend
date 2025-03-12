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
        <Box display="flex" flexDirection="column" mt={10}>
          <Text fontSize={20} color="textColor" style={{ maxWidth: '50%', margin: '0 auto', textAlign: 'center' }}>
            MOBA Artificial Intelligence Draft (AID) is an intelligent tool for training League of Legends coaches and players in the draft process. Here, you will draft against an AI and, at the end, you will have the probability of victory for each team.
          </Text>
          <Text  fontSize={20} color="textColor" style={{ maxWidth: '50%', margin: '10px auto', textAlign: 'center' }}>
            Questions and suggestions should be sent to <a href='mailto:costa@cos.ufrj.br'>costa@cos.ufrj.br</a>.
          </Text>
          <Box display="flex" justifyContent="center" mt={10}>
            <Button onClick={() => history.push('/bans')}>Start</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
})
