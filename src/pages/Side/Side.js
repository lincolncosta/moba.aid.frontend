import React, { memo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { Box } from 'components/Box'
import { Text } from 'components/Text'
import { Button } from 'components/Button'

const RadioWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
`

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 8px;
  border: 2px solid transparent;
  font-weight: bold;
  font-size: 15px;
  transition: all 0.2s ease;
  user-select: none;
  color: ${({ team }) => (team === 'blue' ? '#1E90FF' : '#FF4500')};
  background-color: ${({ team }) => (team === 'blue' ? 'rgba(30, 144, 255, 0.1)' : 'rgba(255, 69, 0, 0.1)')};

  input {
    display: none;
  }

  &.checked {
    background-color: ${({ team }) => (team === 'blue' ? '#1E90FF' : '#FF4500')};
    color: white;
    border-color: ${({ team }) => (team === 'blue' ? '#1E90FF' : '#FF4500')};
  }
`

export const Side = memo(() => {
  const history = useHistory()
  const [time, setTime] = useState('')

  const terminarSide = () => {
    history.push({
      pathname: '/bans',
      state: { meuTime: time }
    })
  }

  const handleSelectTime = (e) => {
    setTime(e.target.value)
  }

  return (
    <Box
      display="flex"
      flex={1}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Text fontWeight={3} fontSize={40} color="textColor" mb={10}>
        Which side are you playing?
      </Text>

      <RadioWrapper>
        <RadioLabel
          team="blue"
          className={time === 'BLUE' ? 'checked' : ''}
        >
          <input type="radio" name="meuTime" value="BLUE" onChange={handleSelectTime} />
          💙 Blue team
        </RadioLabel>
        <RadioLabel
          team="red"
          className={time === 'RED' ? 'checked' : ''}
        >
          <input type="radio" name="meuTime" value="RED" onChange={handleSelectTime} />
          ❤️ Red team
        </RadioLabel>
      </RadioWrapper>

      <Box mt={10} mb={10} display="flex" justifyContent="center">
        <Button disabled={!time} onClick={() => terminarSide()}>
          Next step
        </Button>
      </Box>
    </Box>
  )
})
