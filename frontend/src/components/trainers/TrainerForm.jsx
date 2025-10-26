import React, { useState, useEffect } from 'react'
import { createTrainer, updateTrainer } from '../../services/api'
import { showToast } from '../common/Toast'

const TrainerForm = ({ trainer, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    specialization: [],
    contact: '',
    bio: '',
    certifications: [],
    availability: []
  })
  const [loading, setLoading] = useState(false)
  const [specializationInput, setSpecializationInput] = useState('')
  const [certificationInput, setCertificationInput] = useState('')
  const [availabilityEntry, setAvailabilityEntry] = useState({
    day: 'Monday',
    startTime: '',
    endTime: ''
  })

  useEffect(() => {
    if (trainer) {
      setFormData({
        name: trainer.name || '',
        specialization: trainer.specialization || [],
        contact: trainer.contact || '',
        bio: trainer.bio || '',
        certifications: trainer.certifications || [],
        availability: trainer.availability || []
      })
    }
  }, [trainer])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const addSpecialization = () => {
    if (specializationInput.trim()) {
      setFormData({
        ...formData,
        specialization: [...formData.specialization, specializationInput.trim()]
      })
      setSpecializationInput('')
    }
  }

  const removeSpecialization = (index) => {
    setFormData({
      ...formData,
      specialization: formData.specialization.filter((_, i) => i !== index)
    })
  }

  const addCertification = () => {
    if (certificationInput.trim()) {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, certificationInput.trim()]
      })
      setCertificationInput('')
    }
  }

  const removeCertification = (index) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_, i) => i !== index)
    })
  }

  const addAvailability = () => {
    if (availabilityEntry.day && availabilityEntry.startTime && availabilityEntry.endTime) {
      setFormData({
        ...formData,
        availability: [...formData.availability, availabilityEntry]
      })
      setAvailabilityEntry({ day: 'Monday', startTime: '', endTime: '' })
    }
  }

  const removeAvailability = (index) => {
    setFormData({
      ...formData,
      availability: formData.availability.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (trainer) {
        await updateTrainer(trainer._id, formData)
        showToast('Trainer updated successfully', 'success')
      } else {
        await createTrainer(formData)
        showToast('Trainer created successfully', 'success')
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
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
      {!trainer && (
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
        <label className="block text-sm font-medium mb-1">Contact</label>
        <input
          type="tel"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className="input"
          rows="3"
        />
      </div>

      {/* Specialization */}
      <div>
        <label className="block text-sm font-medium mb-1">Specialization</label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={specializationInput}
            onChange={(e) => setSpecializationInput(e.target.value)}
            className="input flex-1"
            placeholder="Add specialization"
          />
          <button type="button" onClick={addSpecialization} className="btn btn-secondary">
            Add
          </button>
        </div>
        {formData.specialization.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.specialization.map((spec, index) => (
              <span key={index} className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm flex items-center">
                {spec}
                <button
                  type="button"
                  onClick={() => removeSpecialization(index)}
                  className="ml-2 text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Certifications */}
      <div>
        <label className="block text-sm font-medium mb-1">Certifications</label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={certificationInput}
            onChange={(e) => setCertificationInput(e.target.value)}
            className="input flex-1"
            placeholder="Add certification"
          />
          <button type="button" onClick={addCertification} className="btn btn-secondary">
            Add
          </button>
        </div>
        {formData.certifications.length > 0 && (
          <div className="space-y-1">
            {formData.certifications.map((cert, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span className="text-sm">{cert}</span>
                <button
                  type="button"
                  onClick={() => removeCertification(index)}
                  className="text-red-600 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Availability */}
      <div>
        <label className="block text-sm font-medium mb-1">Availability</label>
        <div className="grid grid-cols-3 gap-2 mb-2">
          <select
            value={availabilityEntry.day}
            onChange={(e) => setAvailabilityEntry({ ...availabilityEntry, day: e.target.value })}
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
            value={availabilityEntry.startTime}
            onChange={(e) => setAvailabilityEntry({ ...availabilityEntry, startTime: e.target.value })}
            className="input"
          />
          <input
            type="time"
            value={availabilityEntry.endTime}
            onChange={(e) => setAvailabilityEntry({ ...availabilityEntry, endTime: e.target.value })}
            className="input"
          />
        </div>
        <button type="button" onClick={addAvailability} className="btn btn-secondary mb-2">
          Add Slot
        </button>
        {formData.availability.length > 0 && (
          <div className="space-y-1">
            {formData.availability.map((slot, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span className="text-sm">
                  {slot.day}: {slot.startTime} - {slot.endTime}
                </span>
                <button
                  type="button"
                  onClick={() => removeAvailability(index)}
                  className="text-red-600 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex space-x-3 pt-4 border-t sticky bottom-0 bg-white">
        <button type="submit" disabled={loading} className="btn btn-primary flex-1">
          {loading ? 'Saving...' : trainer ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default TrainerForm