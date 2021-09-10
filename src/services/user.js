import axios from 'axios'
import interceptors from './interceptors'

const API_URL = `${process.env.API_URL}api/v1/user`

export const registerUser = (payload) => {
  return axios.post(`${API_URL}/register`, payload)
}

export const login = (payload) => {
  return axios.post(`${API_URL}/login`, payload)
}

export const getUser = () => {
  return axios.get(`${API_URL}/me`)
}

export const getUserByUsername = (payload) => {
  return axios.get(`${API_URL}/${payload}`)
}

export const updateUser = (payload) => {
  return axios.put(`${API_URL}/me`, payload)
}

interceptors(axios)
