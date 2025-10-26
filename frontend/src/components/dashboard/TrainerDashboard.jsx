import React, { useState, useEffect } from 'react'
import { getTrainerDashboard } from '../../services/api'
import Card from '../common/Card'
import Table from '../common/Table'
import { formatDate } from '../../services/utils/helpers'

const TrainerDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const response = await getTrainerDashboard()
      setData(response.data)
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const bookingColumns = [
    { header: 'Member', accessor: 'memberId', render: (row) => row.memberId?.name },
    { header: 'Class', accessor: 'classId', render: (row) => row.classId?.name },
    { header: 'Date', accessor: 'bookingDate', render: (row) => formatDate(row.bookingDate) },
    { header: 'Time', accessor: 'time' },
    { header: 'Phone', accessor: 'phone', render: (row) => row.memberId?.phone }
  ]

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Trainer Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-gray-500 text-sm">My Classes</p>
            <p className="text-3xl font-bold text-primary-600">
              {data?.totalClasses || 0}
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-gray-500 text-sm">Today's Bookings</p>
            <p className="text-3xl font-bold text-green-600">
              {data?.todayBookings || 0}
            </p>
          </div>
        </Card>
      </div>

      {/* My Classes */}
      <Card title="My Classes">
        <div className="space-y-4">
          {data?.classes?.map((cls) => (
            <div key={cls._id} className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg">{cls.name}</h3>
              <p className="text-sm text-gray-600">{cls.description}</p>
              <div className="mt-2 flex items-center space-x-4 text-sm">
                <span className="text-gray-600">
                  Capacity: {cls.currentBookings}/{cls.maxCapacity}
                </span>
                <span className="text-gray-600">
                  Duration: {cls.durationMinutes} mins
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Today's Bookings */}
      <Card title="Today's Bookings">
        <Table columns={bookingColumns} data={data?.bookings || []} />
      </Card>
    </div>
  )
}

export default TrainerDashboard