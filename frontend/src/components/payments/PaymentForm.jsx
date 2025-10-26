import React, { useState, useEffect } from 'react'
import { getMembers, createPayment } from '../../services/api'
import { showToast } from '../common/Toast'

const PaymentForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    memberId: '',
    amount: '',
    method: 'Cash',
    transactionId: ''
  })
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await getMembers()
      setMembers(response.data)
    } catch (error) {
      showToast('Error fetching members', 'error')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createPayment(formData)
      showToast('Payment recorded successfully', 'success')
      onSuccess()
      onClose()
    } catch (error) {
      showToast(error.message || 'Payment failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Select Member</label>
        <select
          name="memberId"
          value={formData.memberId}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="">Choose a member</option>
          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name} - {member.membershipType} ({member.phone})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="input"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Payment Method</label>
        <select
          name="method"
          value={formData.method}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="UPI">UPI</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Transaction ID (Optional)</label>
        <input
          type="text"
          name="transactionId"
          value={formData.transactionId}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div className="flex space-x-3">
        <button type="submit" disabled={loading} className="btn btn-primary flex-1">
          {loading ? 'Processing...' : 'Record Payment'}
        </button>
        <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default PaymentForm