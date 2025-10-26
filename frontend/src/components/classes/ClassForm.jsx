import React, { useState, useEffect } from 'react'
import { createClass, updateClass, getTrainers } from '../../services/api'
import { showToast } from '../common/Toast'

const ClassForm = ({ classData, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    trainerId: '',
    maxCapacity: 10,
    durationMinutes: 60,
    description: '',
    difficulty: 'Beginner',
    schedule: []
  })
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(false)
  const [scheduleEntry, setScheduleEntry] = useState({
    day: 'Monday',
    startTime: '',
    endTime: ''
  })

  useEffect(() => {
    fetchTrainers()
    if (classData) {
      setFormData({
        name: classData.name || '',
        trainerId: classData.trainerId?._id || '',
        maxCapacity: classData.maxCapacity || 10,
        durationMinutes: classData.durationMinutes || 60,
        description: classData.description || '',
        difficulty: classData.difficulty || 'Beginner',
        schedule: classData.schedule || []
      })
    }
  }, [classData])

  const fetchTrainers = async () => {
    try {
      const response = await getTrainers()
      setTrainers(response.data)
    } catch (error) {
      showToast('Error fetching trainers', 'error')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleScheduleChange = (e) => {
    setScheduleEntry({ ...scheduleEntry, [e.target.name]: e.target.value })
  }

  const addSchedule = () => {
    if (scheduleEntry.day && scheduleEntry.startTime && scheduleEntry.endTime) {
      setFormData({
        ...formData,
        schedule: [...formData.schedule, scheduleEntry]
      })
      setScheduleEntry({ day: 'Monday', startTime: '', endTime: '' })
    } else {
      showToast('Please fill all schedule fields', 'error')
    }
  }

  const removeSchedule = (index) => {
    setFormData({
      ...formData,
      schedule: formData.schedule.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (classData) {
        await updateClass(classData._id, formData)
        showToast('Class updated successfully', 'success')
      } else {
        await createClass(formData)
        showToast('Class created successfully', 'success')
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
      <div>
        <label className="block text-sm font-medium mb-1">Class Name</label>
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
        <label className="block text-sm font-medium mb-1">Trainer</label>
        <select
          name="trainerId"
          value={formData.trainerId}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="">Select Trainer</option>
          {trainers.map((trainer) => (
            <option key={trainer._id} value={trainer._id}>
              {trainer.name} - {trainer.specialization.join(', ')}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Max Capacity</label>
          <input
            type="number"
            name="maxCapacity"
            value={formData.maxCapacity}
            onChange={handleChange}
            className="input"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
          <input
            type="number"
            name="durationMinutes"
            value={formData.durationMinutes}
            onChange={handleChange}
            className="input"
            min="15"
            step="15"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Difficulty</label>
        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input"
          rows="3"
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Schedule</h3>
        
        <div className="grid grid-cols-3 gap-2 mb-2">
          <select
            name="day"
            value={scheduleEntry.day}
            onChange={handleScheduleChange}
            className="input"
          >
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
          <input
            type="time"
            name="startTime"
            value={scheduleEntry.startTime}
            onChange={handleScheduleChange}
            className="input"
          />
          <input
            type="time"
            name="endTime"
            value={scheduleEntry.endTime}
            onChange={handleScheduleChange}
            className="input"
          />
        </div>
        
        <button
          type="button"
          onClick={addSchedule}
          className="btn btn-secondary mb-3"
        >
          Add Schedule
        </button>

        {formData.schedule.length > 0 && (
          <div className="space-y-2">
            {formData.schedule.map((slot, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span className="text-sm">
                  {slot.day}: {slot.startTime} - {slot.endTime}
                </span>
                <button
                  type="button"
                  onClick={() => removeSchedule(index)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex space-x-3">
        <button type="submit" disabled={loading} className="btn btn-primary flex-1">
          {loading ? 'Saving...' : classData ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default ClassForm