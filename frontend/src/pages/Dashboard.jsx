import React from 'react'
import { useAuth } from '../context/AuthContext'
import AdminDashboard from '../components/dashboard/AdminDashboard'
import TrainerDashboard from '../components/dashboard/TrainerDashboard'
import MemberDashboard from '../components/dashboard/MemberDashboard'

const Dashboard = () => {
  const { user } = useAuth()

  const renderDashboard = () => {
    switch (user?.role) {
      case 'Admin':
        return <AdminDashboard />
      case 'Trainer':
        return <TrainerDashboard />
      case 'Member':
        return <MemberDashboard />
      default:
        return <div>Loading...</div>
    }
  }

  return renderDashboard()
}

export default Dashboard