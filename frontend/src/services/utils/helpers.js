import { format, parseISO } from 'date-fns'

export const formatDate = (date) => {
  if (!date) return ''
  try {
    return format(parseISO(date), 'MMM dd, yyyy')
  } catch {
    return format(new Date(date), 'MMM dd, yyyy')
  }
}

export const formatDateTime = (date) => {
  if (!date) return ''
  try {
    return format(parseISO(date), 'MMM dd, yyyy hh:mm a')
  } catch {
    return format(new Date(date), 'MMM dd, yyyy hh:mm a')
  }
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// Alternative format if you prefer "Rs" instead of "LKR"
export const formatCurrencySimple = (amount) => {
  return `Rs ${new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)}`
}

export const getStatusColor = (status) => {
  const colors = {
    Active: 'bg-green-100 text-green-800',
    Suspended: 'bg-yellow-100 text-yellow-800',
    Expired: 'bg-red-100 text-red-800',
    Confirmed: 'bg-blue-100 text-blue-800',
    Cancelled: 'bg-gray-100 text-gray-800',
    Completed: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Failed: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const getDifficultyColor = (difficulty) => {
  const colors = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-yellow-100 text-yellow-800',
    Advanced: 'bg-red-100 text-red-800'
  }
  return colors[difficulty] || 'bg-gray-100 text-gray-800'
}