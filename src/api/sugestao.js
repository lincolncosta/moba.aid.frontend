const axios = require('axios')

export const getSugestao = (data) =>
  axios.post(`${process.env.REACT_APP_API_URL}/suggest`, data).then((data) => data.data)
