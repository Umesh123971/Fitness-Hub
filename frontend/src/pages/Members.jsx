import React, { useState } from 'react'
import Card from '../components/common/Card'
import Modal from '../components/common/Modal'
import MemberList from '../components/members/MemberList'
import MemberForm from '../components/members/MemberForm'
import MemberProfile from '../components/members/MemberProfile'

const Members = () => {
  const [showModal, setShowModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAdd = () => {
    setSelectedMember(null)
    setShowModal(true)
  }

  const handleEdit = (member) => {
    setSelectedMember(member)
    setShowModal(true)
  }

  const handleView = (member) => {
    setSelectedMember(member)
    setShowProfileModal(true)
  }

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Members</h1>
        <button onClick={handleAdd} className="btn btn-primary">
          Add Member
        </button>
      </div>

      <Card>
        <MemberList 
          key={refreshKey}
          onEdit={handleEdit} 
          onView={handleView}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedMember ? 'Edit Member' : 'Add New Member'}
        size="lg"
      >
        <MemberForm
          member={selectedMember}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      </Modal>

      {/* Profile Modal */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="Member Profile"
        size="lg"
      >
        <MemberProfile member={selectedMember} />
      </Modal>
    </div>
  )
}

export default Members