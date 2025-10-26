import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/common/Card'
import Modal from '../components/common/Modal'
import BookingList from '../components/bookings/BookingList'
import BookingForm from '../components/bookings/BookingForm'

const Bookings = () => {
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAdd = () => {
    setShowModal(true)
  }

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Bookings</h1>
        {user?.role === 'Member' && (
          <button onClick={handleAdd} className="btn btn-primary">
            Book a Class
          </button>
        )}
      </div>

      <Card>
        <BookingList key={refreshKey} />
      </Card>

      {/* Booking Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Book a Class"
        size="md"
      >
        <BookingForm
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      </Modal>
    </div>
  )
}

export default Bookings