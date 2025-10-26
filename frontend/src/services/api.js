import axios from 'axios'

// Base URL: uses .env variable if available, otherwise defaults to localhost:5000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Create Axios instance - DO NOT add /api here
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ====== REQUEST INTERCEPTOR ======
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ====== RESPONSE INTERCEPTOR ======
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || error.message)
  }
)

// ===================== AUTH API =====================
export const login = async (email, password) => {
  return await api.post('/api/auth/login', { email, password })
}

export const register = async (userData) => {
  return await api.post('/api/auth/register', userData)
}

export const getProfile = async () => {
  return await api.get('/api/auth/profile')
}

// ===================== MEMBERS API =====================
export const getMembers = async (params) => {
  return await api.get('/api/members', { params })
}

export const getMember = async (id) => {
  return await api.get(`/api/members/${id}`)
}

export const createMember = async (data) => {
  return await api.post('/api/members', data)
}

export const updateMember = async (id, data) => {
  return await api.put(`/api/members/${id}`, data)
}

export const deleteMember = async (id) => {
  return await api.delete(`/api/members/${id}`)
}

// ===================== CLASSES API =====================
export const getClasses = async () => {
  return await api.get('/api/classes')
}

export const getClassSchedule = async () => {
  return await api.get('/api/classes/schedule')
}

export const getClass = async (id) => {
  return await api.get(`/api/classes/${id}`)
}

export const createClass = async (data) => {
  return await api.post('/api/classes', data)
}

export const updateClass = async (id, data) => {
  return await api.put(`/api/classes/${id}`, data)
}

export const deleteClass = async (id) => {
  return await api.delete(`/api/classes/${id}`)
}

// ===================== BOOKINGS API =====================
export const getBookings = async () => {
  return await api.get('/api/bookings')
}

export const getMyUpcomingBookings = async () => {
  return await api.get('/api/bookings/my/upcoming')
}

export const createBooking = async (data) => {
  return await api.post('/api/bookings', data)
}

export const cancelBooking = async (id) => {
  return await api.delete(`/api/bookings/${id}`)
}

// ===================== PAYMENTS API =====================
export const getPayments = async (params) => {
  return await api.get('/api/payments', { params })
}

export const getMemberPayments = async (memberId) => {
  return await api.get(`/api/payments/member/${memberId}`)
}

export const createPayment = async (data) => {
  return await api.post('/api/payments', data)
}

export const getExpiringMemberships = async (days) => {
  return await api.get('/api/payments/expiring', { params: { days } })
}

// ===================== TRAINERS API =====================
export const getTrainers = async () => {
  return await api.get('/api/trainers')
}

export const createTrainer = async (data) => {
  return await api.post('/api/trainers', data)
}

export const updateTrainer = async (id, data) => {
  return await api.put(`/api/trainers/${id}`, data)
}

export const deleteTrainer = async (id) => {
  return await api.delete(`/api/trainers/${id}`)
}

// ===================== DASHBOARD API =====================
export const getDashboardSummary = async () => {
  return await api.get('/api/dashboard/summary')
}

export const getTrainerDashboard = async () => {
  return await api.get('/api/dashboard/trainer')
}

export const getMemberDashboard = async () => {
  return await api.get('/api/dashboard/member')
}

// Default export
export default api