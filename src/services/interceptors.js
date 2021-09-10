import { logOut } from 'utils/auth'

const interceptors = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    async (config) => {
      const token = localStorage.getItem('token')

      config.headers = {
        Authorization: `Bearer ${token}`,
      }
      return config
    },
    (error) => {
      Promise.reject(error)
    }
  )

  axiosInstance.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        logOut()
        window.location.replace('/login')
      }
      return Promise.reject(error)
    }
  )
}

export default interceptors
