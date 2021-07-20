import React from 'react'

import { Box } from '../Box'
import { Text } from '../Text'
import { Loading } from '../Loading'
import { Campeao } from '../Campeao'

import campeoes from '../../database/champions.json'

export const Sugestao = ({ isLoading, campeoesSugeridos = [] }) => {
  return (
    <Box pt={5} display="flex" alignItems="center" flexDirection="column" style={{ borderTop: '1px solid yellow' }}>
      <Text mb={5} fontWeight={3} fontSize={18} color="textColor">
        Suggestions
      </Text>
      {isLoading ? (
        <Box alignItems="center" justifyContent="center" display="flex" flex={1} p={15}>
          <Loading height={30} width={30} />
        </Box>
      ) : (
        <Box display="flex" justifyContent="space-around">
          {campeoesSugeridos.map((sugestao, index) => {
            const campeao = campeoes.find((c) => c.id === sugestao.campeao)

            return (
              <Campeao key={index} nome={campeao.name} alias={campeao.alias} rota={sugestao.rota} fontSizeNome={15} />
            )
          })}
        </Box>
      )}
    </Box>
  )
}
