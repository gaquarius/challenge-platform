import axios from 'axios'
import interceptors from './interceptors'

const API_URL = `${process.env.API_URL}api/v1/challenge`

export const getChallenges = () => {
  return axios.get(`${API_URL}/`)
}

export const getChallengesByUser = (userId) => {
  return axios.get(`${API_URL}/user/${userId}`)
}

export const getChallenge = (id) => {
  return axios.get(`${API_URL}/${id}`)
}

export const createChallenge = (payload) => {
  return axios.post(`${API_URL}/`, payload)
}

export const updateChallenge = (payload) => {
  return axios.put(`${API_URL}/${payload.id}`, payload.data)
}

export const joinChallenge = (payload) => {
  return axios.post(`${API_URL}/${payload.id}/join/`, payload.data)
}

interceptors(axios)
