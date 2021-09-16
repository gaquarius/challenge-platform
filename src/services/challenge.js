import axios from 'axios'
import interceptors from './interceptors'

const API_URL = `${process.env.API_URL}api/v1/challenge`

export const getChallenges = () => {
  return axios.get(`${API_URL}/`)
}

export const getChallengesByUser = (payload) => {
  return axios.get(`${API_URL}/${payload}`)
}

interceptors(axios)
