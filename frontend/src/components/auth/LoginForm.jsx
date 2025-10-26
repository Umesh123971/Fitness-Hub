import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { showToast } from '../common/Toast'

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(formData.email, formData.password)
      showToast('Login successful!', 'success')
    } catch (error) {
      showToast(error.message || 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-primary-600">
          Ceylon Fitness Hub 
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* 
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <p className="text-sm font-semibold mb-2">Demo Credentials:</p>
          <p className="text-xs text-gray-600">Admin: admin@21cfitness.com / admin123</p>
          <p className="text-xs text-gray-600">Trainer: john.trainer@21cfitness.com / trainer123</p>
          <p className="text-xs text-gray-600">Member: jane.member@21cfitness.com / member123</p>
        </div>
        */}
      </div>
    </div>
  )
}

export default LoginForm
