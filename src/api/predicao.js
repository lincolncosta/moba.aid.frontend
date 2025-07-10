const axios = require('axios')

export const getPredicao = (data) =>
  axios.post(`${process.env.REACT_APP_API_URL}/predict`, data).then((data) => data.data)
