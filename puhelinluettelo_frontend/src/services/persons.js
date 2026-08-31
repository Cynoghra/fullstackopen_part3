import axios from 'axios'

// muutettu tehtävää 3.9 varten backendiin yhdistykseen
const baseUrl = '/api/persons' // poistettiin localhost renderiä varten

const getAll = () => {
  return axios.get(baseUrl)
}

const create = (newObject) => {
  return axios.post(baseUrl, newObject)
}

const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

export default {
  getAll,
  create,
  deletePerson,
  update
}