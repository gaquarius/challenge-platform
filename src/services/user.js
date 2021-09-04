import axios from 'axios'

const API_URL = `${process.env.API_URL}api/user`

export const registerUser = (payload) => {
  return axios.post(`${API_URL}/register`, payload)
}

export const login = (payload) => {
  return axios.post(`${API_URL}/login`, payload)
}
