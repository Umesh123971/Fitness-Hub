import React, { useState, useEffect } from 'react'
import { getPayments } from '../../services/api'
import Table from '../common/Table'
import { showToast } from '../common/Toast'
import { formatDate, formatCurrency, getStatusColor } from '../../services/utils/helpers'

const PaymentList = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    fetchPayments()
  }, [filters])

  const fetchPayments = async () => {
    try {
      const response = await getPayments(filters)
      setPayments(response.data)
    } catch (error) {
      showToast('Error fetching payments', 'error')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { header: 'Member', accessor: 'memberId', render: (row) => row.memberId?.name },
    { header: 'Phone', accessor: 'phone', render: (row) => row.memberId?.phone },
    { header: 'Amount', accessor: 'amount', render: (row) => formatCurrency(row.amount) },
    { header: 'Method', accessor: 'method' },
    { header: 'Payment Date', accessor: 'paymentDate', render: (row) => formatDate(row.paymentDate) },
    { header: 'Renewal Date', accessor: 'renewalDate', render: (row) => formatDate(row.renewalDate) },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      )
    },
    { header: 'Transaction ID', accessor: 'transactionId' }
  ]

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="input"
        >
          <option value="">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          placeholder="Start Date"
          className="input"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          placeholder="End Date"
          className="input"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <Table columns={columns} data={payments} />
      )}
    </div>
  )
}

export default PaymentList