import React, { useState, useEffect } from 'react'
import { createMember, updateMember } from '../../services/api'
import { showToast } from '../common/Toast'

const MemberForm = ({ member, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    phone: '',
    membershipType: 'Monthly',
    address: '',
    emergencyContact: {
      name: '',
      phone: ''
    }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        phone: member.phone || '',
        membershipType: member.membershipType || 'Monthly',
        address: member.address || '',
        emergencyContact: member.emergencyContact || { name: '', phone: '' }
      })
    }
  }, [member])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('emergency.')) {
      const field = name.split('.')[1]
      setFormData({
        ...formData,
        emergencyContact: { ...formData.emergencyContact, [field]: value }
      })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (member) {
        await updateMember(member._id, formData)
        showToast('Member updated successfully', 'success')
      } else {
        await createMember(formData)
        showToast('Member created successfully', 'success')
      }
      onSuccess()
      onClose()
    } catch (error) {
      showToast(error.message || 'Operation failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!member && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Membership Type</label>
        <select
          name="membershipType"
          value={formData.membershipType}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Annual">Annual</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="input"
          rows="3"
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Emergency Contact</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="emergency.name"
              value={formData.emergencyContact.name}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="emergency.phone"
              value={formData.emergencyContact.phone}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button type="submit" disabled={loading} className="btn btn-primary flex-1">
          {loading ? 'Saving...' : member ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default MemberForm