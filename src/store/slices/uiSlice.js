import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarOpen: true,
  modals: {
    customerForm: false,
    productForm: false,
    feedbackForm: false,
    vocForm: false,
    confirmDialog: false,
    detailModal: false
  },
  confirmDialog: {
    open: false,
    title: '',
    message: '',
    onConfirm: null
  },
  detailModal: {
    open: false,
    type: null, // 'customer', 'product', 'feedback', etc.
    data: null
  },
  modalData: null, // Store data for forms
  notifications: [],
  globalLoading: false
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    openModal: (state, action) => {
      const { modalName, data } = action.payload
      state.modals[modalName] = true
      state.modalData = data || null
      if (data && modalName === 'detailModal') {
        state.detailModal = { ...state.detailModal, ...data, open: true }
      }
    },
    closeModal: (state, action) => {
      const modalName = action.payload
      state.modals[modalName] = false
      state.modalData = null
      if (modalName === 'detailModal') {
        state.detailModal = { open: false, type: null, data: null }
      }
      if (modalName === 'confirmDialog') {
        state.confirmDialog = { open: false, title: '', message: '', onConfirm: null }
      }
    },
    showConfirmDialog: (state, action) => {
      state.confirmDialog = {
        open: true,
        ...action.payload
      }
      state.modals.confirmDialog = true
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload
      })
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload
    }
  }
})

export const {
  toggleSidebar,
  closeSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  showConfirmDialog,
  addNotification,
  removeNotification,
  setGlobalLoading
} = uiSlice.actions

export default uiSlice.reducer