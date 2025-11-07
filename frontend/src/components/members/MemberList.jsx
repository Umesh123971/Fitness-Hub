import React, { useState, useEffect } from 'react'
import { getMembers, deleteMember } from '../../services/api'
import Table from '../common/Table'
import { showToast } from '../common/Toast'
import { formatDate, getStatusColor } from '../../services/utils/helpers'

const MemberList = ({ onEdit, onView }) => {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    membershipType: '',
    search: ''
  })

  useEffect(() => {
    fetchMembers()
  }, [filters])

  const fetchMembers = async () => {
    try {
      const response = await getMembers(filters)
      setMembers(response.data)
    } catch (error) {
      const message = error.response?.data?.message || 'Error fetching members'
      showToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await deleteMember(id)
        showToast('Member deleted successfully', 'success')
        fetchMembers()
      } catch (error) {
        const message = error.response?.data?.message || 'Error deleting member'
        showToast(message, 'error')
      }
    }
  }

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Email', accessor: 'userId', render: (row) => row.userId?.email },
    { header: 'Membership', accessor: 'membershipType' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      )
    },
    { header: 'Join Date', accessor: 'joinDate', render: (row) => formatDate(row.joinDate) },
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

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="input"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="input"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
          <option value="Expired">Expired</option>
        </select>
        <select
          value={filters.membershipType}
          onChange={(e) => setFilters({ ...filters, membershipType: e.target.value })}
          className="input"
        >
          <option value="">All Memberships</option>
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Annual">Annual</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <Table columns={columns} data={members} />
      )}
    </div>
  )
}

export default MemberList