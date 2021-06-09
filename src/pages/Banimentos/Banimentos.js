import React, { memo } from 'react'

import { Box } from 'components/Box'
import { Text } from 'components/Text'
import { PicksBans } from 'components/PicksBans'

export const Banimentos = memo(() => {
  return (
    <Box display="flex" flex={1} flexDirection="column">
      <Box mt={20} display="flex" flex={1} alignItems="center" flexDirection="column">
        <Text mb={5} fontWeight={3} fontSize={50} color="textColor">
          Faça seus bans
        </Text>
      </Box>
      <PicksBans selecaoAtiva />
    </Box>
  )
})
