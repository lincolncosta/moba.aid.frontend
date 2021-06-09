const axios = require('axios')

export const getSugestao = () => axios.get(`${process.env.REACT_APP_API_URL}/lalala`).then((data) => data.data)
