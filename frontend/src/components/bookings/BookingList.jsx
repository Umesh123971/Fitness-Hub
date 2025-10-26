import React, { useState, useEffect } from 'react'
import { getBookings, cancelBooking } from '../../services/api'
import Table from '../common/Table'
import { showToast } from '../common/Toast'
import { formatDate, getStatusColor } from '../../services/utils/helpers'

const BookingList = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await getBookings()
      setBookings(response.data)
    } catch (error) {
      showToast('Error fetching bookings', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(id)
        showToast('Booking cancelled successfully', 'success')
        fetchBookings()
      } catch (error) {
        showToast('Error cancelling booking', 'error')
      }
    }
  }

  const columns = [
    { header: 'Member', accessor: 'memberId', render: (row) => row.memberId?.name },
    { header: 'Class', accessor: 'classId', render: (row) => row.classId?.name },
    { header: 'Trainer', accessor: 'trainer', render: (row) => row.classId?.trainerId?.name },
    { header: 'Date', accessor: 'bookingDate', render: (row) => formatDate(row.bookingDate) },
    { header: 'Time', accessor: 'time' },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        row.status === 'Confirmed' && (
          <button
            onClick={() => handleCancel(row._id)}
            className="text-red-600 hover:underline"
          >
            Cancel
          </button>
        )
      )
    }
  ]

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return <Table columns={columns} data={bookings} />
}

export default BookingList