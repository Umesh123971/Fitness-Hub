import React, { useState, useEffect } from 'react'
import { getDashboardSummary } from '../../services/api'
import Card from '../common/Card'
import { formatCurrency } from '../../services/utils/helpers'

const AdminDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const response = await getDashboardSummary()
      setData(response.data)
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-gray-500 text-sm">Active Members</p>
            <p className="text-3xl font-bold text-primary-600">
              {data?.summary?.totalActiveMembers || 0}
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-gray-500 text-sm">Classes Today</p>
            <p className="text-3xl font-bold text-green-600">
              {data?.summary?.classesToday || 0}
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-gray-500 text-sm">Revenue This Month</p>
            <p className="text-3xl font-bold text-blue-600">
              {formatCurrency(data?.summary?.revenueThisMonth || 0)}
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-gray-500 text-sm">Available Slots</p>
            <p className="text-3xl font-bold text-purple-600">
              {data?.summary?.availableSlots || 0}
            </p>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Monthly Signups">
          <div className="space-y-2">
            {data?.charts?.monthlySignups?.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm">
                  {new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
                <span className="font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Most Booked Classes">
          <div className="space-y-2">
            {data?.charts?.mostBookedClasses?.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm">{item.className}</span>
                <span className="font-semibold">{item.bookingCount} bookings</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Alerts */}
      {data?.summary?.expiringMemberships > 0 && (
        <Card className="bg-yellow-50 border border-yellow-200">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600 font-semibold">⚠️</span>
            <p className="text-yellow-800">
              {data.summary.expiringMemberships} membership(s) expiring in the next 7 days
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default AdminDashboard