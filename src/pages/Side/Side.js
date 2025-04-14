import React, { memo, useState } from 'react'

import { useHistory } from 'react-router-dom'

import { Box } from 'components/Box'
import { Text } from 'components/Text'
import { Button } from 'components/Button'


export const Side = memo(() => {
  const history = useHistory()
  const [time, setTime] = useState([])


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
    <Box display="flex" flex={1} flexDirection="column" alignItems="center">
      <Box mb={10} display="flex" flex={1} alignItems="center">
        <Text fontWeight={3} fontSize={40} color="textColor">
          Side decision
        </Text>
      </Box>

      <Text fontWeight={3} fontSize={40} color="textColor" mt={10} mb={10}>
        Which side are you playing?
      </Text>

      <div className="radio">
        <label>
          <input type="radio" name="meuTime" value="BLUE" onChange={handleSelectTime} />
          <Text fontWeight={2} fontSize={15} color="textColor">
            Blue team
          </Text>
        </label>
      </div>
      <div className="radio">
        <label>
          <input type="radio" name="meuTime" value="RED" onChange={handleSelectTime} />
          <Text fontWeight={2} fontSize={15} color="textColor">
            Red team
          </Text>
        </label>
      </div>

      <Box mt={10} mb={10} display="flex" justifyContent="center">
        <Button disabled={!time.length} onClick={() => terminarSide()}>
          Next step
        </Button>
      </Box>
    </Box>
  )
})
