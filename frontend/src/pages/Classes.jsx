import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/common/Card'
import Modal from '../components/common/Modal'
import ClassList from '../components/classes/ClassList'
import ClassForm from '../components/classes/ClassForm'
import ClassCalendar from '../components/classes/ClassCalendar'

const Classes = () => {
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAdd = () => {
    setSelectedClass(null)
    setShowModal(true)
  }

  const handleEdit = (classData) => {
    setSelectedClass(classData)
    setShowModal(true)
  }

  const handleView = (classData) => {
    setSelectedClass(classData)
    // You can create a ClassDetails component similar to MemberProfile
    alert(`Class: ${classData.name}\nTrainer: ${classData.trainerId?.name}\nDescription: ${classData.description}`)
  }

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Classes</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowCalendar(!showCalendar)} 
            className="btn btn-secondary"
          >
            {showCalendar ? 'Show List' : 'Show Calendar'}
          </button>
          {user?.role === 'Admin' && (
            <button onClick={handleAdd} className="btn btn-primary">
              Add Class
            </button>
          )}
        </div>
      </div>

      <Card>
        {showCalendar ? (
          <ClassCalendar key={refreshKey} />
        ) : (
          <ClassList 
            key={refreshKey}
            onEdit={handleEdit} 
            onView={handleView}
          />
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedClass ? 'Edit Class' : 'Add New Class'}
        size="lg"
      >
        <ClassForm
          classData={selectedClass}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      </Modal>
    </div>
  )
}

export default Classes