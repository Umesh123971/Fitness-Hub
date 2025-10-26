import React from 'react'
import { formatDate, getStatusColor } from '../../services/utils/helpers'

const MemberProfile = ({ member }) => {
  if (!member) return null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Name</p>
          <p className="font-semibold">{member.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Email</p>
          <p className="font-semibold">{member.userId?.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Phone</p>
          <p className="font-semibold">{member.phone}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Membership Type</p>
          <p className="font-semibold">{member.membershipType}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Status</p>
          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(member.status)}`}>
            {member.status}
          </span>
        </div>
        <div>
          <p className="text-sm text-gray-600">Join Date</p>
          <p className="font-semibold">{formatDate(member.joinDate)}</p>
        </div>
      </div>

      {member.address && (
        <div>
          <p className="text-sm text-gray-600">Address</p>
          <p className="font-semibold">{member.address}</p>
        </div>
      )}

      {member.emergencyContact && (member.emergencyContact.name || member.emergencyContact.phone) && (
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {member.emergencyContact.name && (
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{member.emergencyContact.name}</p>
              </div>
            )}
            {member.emergencyContact.phone && (
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold">{member.emergencyContact.phone}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MemberProfile