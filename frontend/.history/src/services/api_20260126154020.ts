import axios from 'axios'

const api = axios.create({
  baseURL: 'https://your-backend-api.com/api', // change to your backend URL
  timeout: 10000
})

// Add auth token interceptor if needed
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api