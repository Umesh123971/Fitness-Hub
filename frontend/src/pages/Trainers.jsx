import React, { useState } from 'react'
import Card from '../components/common/Card'
import Modal from '../components/common/Modal'
import TrainerList from '../components/trainers/TrainerList'
import TrainerForm from '../components/trainers/TrainerForm'

const Trainers = () => {
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedTrainer, setSelectedTrainer] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAdd = () => {
    setSelectedTrainer(null)
    setShowModal(true)
  }

  const handleEdit = (trainer) => {
    setSelectedTrainer(trainer)
    setShowModal(true)
  }

  const handleView = (trainer) => {
    setSelectedTrainer(trainer)
    setShowViewModal(true)
  }

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Trainers</h1>
        <button onClick={handleAdd} className="btn btn-primary">
          Add Trainer
        </button>
      </div>

      <Card>
        <TrainerList 
          key={refreshKey}
          onEdit={handleEdit} 
          onView={handleView}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedTrainer ? 'Edit Trainer' : 'Add New Trainer'}
        size="xl"
      >
        <TrainerForm
          trainer={selectedTrainer}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Trainer Profile"
        size="lg"
      >
        {selectedTrainer && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{selectedTrainer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{selectedTrainer.userId?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Contact</p>
                <p className="font-semibold">{selectedTrainer.contact}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Specialization</p>
                <p className="font-semibold">{selectedTrainer.specialization?.join(', ')}</p>
              </div>
            </div>

            {selectedTrainer.bio && (
              <div>
                <p className="text-sm text-gray-600">Bio</p>
                <p className="font-semibold">{selectedTrainer.bio}</p>
              </div>
            )}

            {selectedTrainer.certifications && selectedTrainer.certifications.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Certifications</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTrainer.certifications.map((cert, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedTrainer.availability && selectedTrainer.availability.length > 0 && (
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Availability</p>
                <div className="space-y-2">
                  {selectedTrainer.availability.map((slot, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded">
                      <span className="text-sm font-medium">{slot.day}:</span>
                      <span className="text-sm ml-2">{slot.startTime} - {slot.endTime}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Trainers