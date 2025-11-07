import React, { useState, useEffect } from 'react'
import { getTrainers, deleteTrainer } from '../../services/api'
import Table from '../common/Table'
import { showToast } from '../common/Toast'

const TrainerList = ({ onEdit, onView }) => {
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrainers()
  }, [])

  const fetchTrainers = async () => {
    try {
      const response = await getTrainers()
      setTrainers(response.data)
    } catch (error) {
      const message = error.response?.data?.message || 'Error fetching trainers'
      showToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      try {
        await deleteTrainer(id)
        showToast('Trainer deleted successfully', 'success')
        fetchTrainers()
      } catch (error) {
        const message = error.response?.data?.message || 'Error deleting trainer'
        showToast(message, 'error')
      }
    }
  }

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Specialization', accessor: 'specialization', render: (row) => row.specialization.join(', ') },
    { header: 'Contact', accessor: 'contact' },
    { header: 'Email', accessor: 'userId', render: (row) => row.userId?.email },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button onClick={() => onView(row)} className="text-blue-600 hover:underline">
            View
          </button>
          <button onClick={() => onEdit(row)} className="text-green-600 hover:underline">
            Edit
          </button>
          <button onClick={() => handleDelete(row._id)} className="text-red-600 hover:underline">
            Delete
          </button>
        </div>
      )
    }
  ]

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return <Table columns={columns} data={trainers} />
}

export default TrainerList