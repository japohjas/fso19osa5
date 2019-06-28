import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const promise = await axios.get(baseUrl)
  return promise.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const promise = await axios.post(baseUrl, newObject, config)
  return promise.data
}

const replace = async (id, newObject) => {
  const config = {
    headers: { Authorization: token }
  }
  const promise = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return promise.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  const promise = await axios.delete(`${baseUrl}/${id}`, config)
  return promise.data
}

export default { getAll, create, replace, setToken, remove }