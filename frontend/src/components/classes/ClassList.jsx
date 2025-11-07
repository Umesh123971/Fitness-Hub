import React, { useState, useEffect } from 'react'
import { getClasses, deleteClass } from '../../services/api'
import Table from '../common/Table'
import { showToast } from '../common/Toast'
import { getDifficultyColor } from '../../services/utils/helpers'
import { useAuth } from '../../context/AuthContext'

const ClassList = ({ onEdit, onView }) => {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const response = await getClasses()
      setClasses(response.data)
    } catch (error) {
      const message = error.response?.data?.message || 'Error fetching classes'
      showToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await deleteClass(id)
        showToast('Class deleted successfully', 'success')
        fetchClasses()
      } catch (error) {
        const message = error.response?.data?.message || 'Error deleting class'
        showToast(message, 'error')
      }
    }
  }

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Trainer', accessor: 'trainerId', render: (row) => row.trainerId?.name },
    { header: 'Duration', accessor: 'durationMinutes', render: (row) => `${row.durationMinutes} mins` },
    { 
      header: 'Capacity', 
      accessor: 'maxCapacity',
      render: (row) => `${row.currentBookings}/${row.maxCapacity}`
    },
    { 
      header: 'Difficulty', 
      accessor: 'difficulty',
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(row.difficulty)}`}>
          {row.difficulty}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button onClick={() => onView(row)} className="text-blue-600 hover:underline">
            View
          </button>
          {user?.role === 'Admin' && (
            <>
              <button onClick={() => onEdit(row)} className="text-green-600 hover:underline">
                Edit
              </button>
              <button onClick={() => handleDelete(row._id)} className="text-red-600 hover:underline">
                Delete
              </button>
            </>
          )}
        </div>
      )
    }
  ]

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return <Table columns={columns} data={classes} />
}

export default ClassList