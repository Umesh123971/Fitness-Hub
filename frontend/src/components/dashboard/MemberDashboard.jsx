import React, { useState, useEffect } from 'react'
import { getMemberDashboard } from '../../services/api'
import Card from '../common/Card'
import { formatDate, formatCurrency, getStatusColor } from '../../services/utils/helpers'

const MemberDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const response = await getMemberDashboard()
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
      <h1 className="text-3xl font-bold">Member Dashboard</h1>

      {/* Member Info */}
      <Card title="My Profile">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-semibold">{data?.memberInfo?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-semibold">{data?.memberInfo?.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Membership Type</p>
            <p className="font-semibold">{data?.memberInfo?.membershipType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(data?.memberInfo?.status)}`}>
              {data?.memberInfo?.status}
            </span>
          </div>
        </div>
      </Card>

      {/* Upcoming Bookings */}
      <Card title="Upcoming Classes">
        <div className="space-y-4">
          {data?.upcomingBookings?.length > 0 ? (
            data.upcomingBookings.map((booking) => (
              <div key={booking._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{booking.classId?.name}</h3>
                    <p className="text-sm text-gray-600">
                      Trainer: {booking.classId?.trainerId?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(booking.bookingDate)} at {booking.time}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No upcoming bookings</p>
          )}
        </div>
      </Card>

      {/* Recent Payments */}
      <Card title="Recent Payments">
        <div className="space-y-3">
          {data?.recentPayments?.map((payment) => (
            <div key={payment._id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                <p className="text-sm text-gray-600">{formatDate(payment.paymentDate)}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(payment.status)}`}>
                {payment.status}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Next Renewal */}
      {data?.nextRenewal && (
        <Card className="bg-blue-50 border border-blue-200">
          <p className="text-blue-800">
            <span className="font-semibold">Next Renewal:</span>{' '}
            {formatDate(data.nextRenewal.renewalDate)}
          </p>
        </Card>
      )}
    </div>
  )
}

export default MemberDashboard