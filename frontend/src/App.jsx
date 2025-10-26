import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import Classes from './pages/Classes'
import Bookings from './pages/Bookings'
import Payments from './pages/Payments'
import Trainers from './pages/Trainers'

function App() {
  const { user } = useAuth()

  const PrivateRoute = ({ children, roles }) => {
    if (!user) {
      return <Navigate to="/login" />
    }
    
    if (roles && !roles.includes(user.role)) {
      return <Navigate to="/dashboard" />
    }
    
    return children
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="members" element={<PrivateRoute roles={['Admin', 'Trainer']}><Members /></PrivateRoute>} />
        <Route path="trainers" element={<PrivateRoute roles={['Admin']}><Trainers /></PrivateRoute>} />
        <Route path="classes" element={<Classes />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="payments" element={<PrivateRoute roles={['Admin']}><Payments /></PrivateRoute>} />
      </Route>
    </Routes>
  )
}

export default App