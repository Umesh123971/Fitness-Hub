import React, { useState, useEffect } from 'react'
import { getClasses, createBooking } from '../../services/api'
import { showToast } from '../common/Toast'

const BookingForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    classId: '',
    bookingDate: '',
    time: ''
  })
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const response = await getClasses()
      setClasses(response.data)
    } catch (error) {
      showToast('Error fetching classes', 'error')
    }
  }

  const handleClassChange = (e) => {
    const classId = e.target.value
    setFormData({ ...formData, classId })
    const cls = classes.find(c => c._id === classId)
    setSelectedClass(cls)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createBooking(formData)
      showToast('Booking created successfully', 'success')
      onSuccess()
      onClose()
    } catch (error) {
      showToast(error.message || 'Booking failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Select Class</label>
        <select
          name="classId"
          value={formData.classId}
          onChange={handleClassChange}
          className="input"
          required
        >
          <option value="">Choose a class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name} - {cls.trainerId?.name} ({cls.maxCapacity - cls.currentBookings} spots left)
            </option>
          ))}
        </select>
      </div>

      {selectedClass && (
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <p className="text-sm"><strong>Duration:</strong> {selectedClass.durationMinutes} minutes</p>
          <p className="text-sm"><strong>Difficulty:</strong> {selectedClass.difficulty}</p>
          <p className="text-sm"><strong>Description:</strong> {selectedClass.description}</p>
          <p className="text-sm mt-2"><strong>Available Slots:</strong></p>
          <div className="space-y-1 mt-1">
            {selectedClass.schedule?.map((slot, index) => (
              <p key={index} className="text-xs">
                {slot.day}: {slot.startTime} - {slot.endTime}
              </p>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Booking Date</label>
        <input
          type="date"
          name="bookingDate"
          value={formData.bookingDate}
          onChange={handleChange}
          className="input"
          min={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Time Slot</label>
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <div className="flex space-x-3">
        <button type="submit" disabled={loading} className="btn btn-primary flex-1">
          {loading ? 'Booking...' : 'Book Class'}
        </button>
        <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default BookingForm