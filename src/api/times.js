const axios = require('axios')

// Times e jogadores profissionais conhecidos pelo modelo base (elenco mais recente de cada time)
export const getTimes = () =>
  axios.get(`${process.env.REACT_APP_API_URL}/teams`).then((res) => res.data)
