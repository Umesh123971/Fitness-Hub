import React, { useState, useEffect } from 'react'
import { getClassSchedule } from '../../services/api'
import { showToast } from '../common/Toast'
import { getDifficultyColor } from '../../services/utils/helpers'

const ClassCalendar = () => {
  const [schedule, setSchedule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState('Monday')

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  useEffect(() => {
    fetchSchedule()
  }, [])

  const fetchSchedule = async () => {
    try {
      const response = await getClassSchedule()
      setSchedule(response.data)
    } catch (error) {
      showToast('Error fetching schedule', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading schedule...</div>
  }

  return (
    <div className="space-y-4">
      {/* Day Selector */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              selectedDay === day
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Classes for Selected Day */}
      <div className="space-y-3">
        {schedule && schedule[selectedDay]?.length > 0 ? (
          schedule[selectedDay].map((slot, index) => (
            <div key={index} className="card border-l-4 border-primary-600">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{slot.className}</h3>
                  <p className="text-sm text-gray-600">
                    Trainer: {slot.trainer?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Time: {slot.startTime} - {slot.endTime}
                  </p>
                  <p className="text-sm text-gray-600">
                    Duration: {slot.duration} minutes
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-2 ${getDifficultyColor(slot.difficulty)}`}>
                    {slot.difficulty}
                  </span>
                  <p className="text-sm">
                    <span className={slot.availableSpots > 0 ? 'text-green-600' : 'text-red-600'}>
                      {slot.availableSpots} spots
                    </span>
                    {' '} available
                  </p>
                  <p className="text-xs text-gray-500">
                    {slot.currentBookings}/{slot.maxCapacity} booked
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">No classes scheduled for {selectedDay}</p>
        )}
      </div>
    </div>
  )
}

export default ClassCalendar