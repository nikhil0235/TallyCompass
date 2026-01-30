import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  notifications: [],
  unreadCount: 0,
  isOpen: false
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      const notifications = Array.isArray(action.payload)
        ? action.payload
        : (action.payload && Array.isArray(action.payload.notifications))
          ? action.payload.notifications
          : []
      state.notifications = notifications
      state.unreadCount = notifications.filter(n => !n.read).length
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload)
      if (!action.payload.read) {
        state.unreadCount += 1
      }
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification && !notification.read) {
        notification.read = true
        state.unreadCount -= 1
      }
    },
    toggleNotificationPanel: (state) => {
      state.isOpen = !state.isOpen
    },
    closeNotificationPanel: (state) => {
      state.isOpen = false
    }
  }
})

export const { 
  setNotifications, 
  addNotification, 
  markAsRead, 
  toggleNotificationPanel, 
  closeNotificationPanel 
} = notificationSlice.actions

export default notificationSlice.reducer