const axios = require('axios')

export const iniciarSessao = (data) =>
  axios.post(`${process.env.REACT_APP_API_URL}/start`, data).then((res) => res.data)
