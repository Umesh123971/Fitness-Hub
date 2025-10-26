import React, { useState } from 'react'
import Card from '../components/common/Card'
import Modal from '../components/common/Modal'
import PaymentList from '../components/payments/PaymentList'
import PaymentForm from '../components/payments/PaymentForm'

const Payments = () => {
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
        <h1 className="text-3xl font-bold">Payments</h1>
        <button onClick={handleAdd} className="btn btn-primary">
          Record Payment
        </button>
      </div>

      <Card>
        <PaymentList key={refreshKey} />
      </Card>

      {/* Payment Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Record New Payment"
        size="md"
      >
        <PaymentForm
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      </Modal>
    </div>
  )
}

export default Payments