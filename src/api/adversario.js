const axios = require('axios')

// Jogada provável do adversário real (modelo do adversário, E10)
export const getJogadaAdversario = (data) =>
  axios.post(`${process.env.REACT_APP_API_URL}/opponent/move`, data).then((res) => res.data)

// Preparação: tendências de picks e bans de um time
export const getScout = (data) =>
  axios.post(`${process.env.REACT_APP_API_URL}/scout`, data).then((res) => res.data)
