import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  customers: [],
  currentCustomer: null,
  loading: false,
  error: null
}

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    customerStart: (state) => {
      state.loading = true
      state.error = null
    },
    getCustomersSuccess: (state, action) => {
      state.loading = false
      state.customers = action.payload
    },
    getCustomerSuccess: (state, action) => {
      state.loading = false
      state.currentCustomer = action.payload
    },
    createCustomerSuccess: (state, action) => {
      state.loading = false
      state.customers.push(action.payload)
    },
    updateCustomerSuccess: (state, action) => {
      state.loading = false
      const index = state.customers.findIndex(c => c._id === action.payload._id)
      if (index !== -1) {
        state.customers[index] = action.payload
      }
      if (state.currentCustomer?._id === action.payload._id) {
        state.currentCustomer = action.payload
      }
    },
    deleteCustomerSuccess: (state, action) => {
      state.loading = false
      state.customers = state.customers.filter(c => c._id !== action.payload)
      if (state.currentCustomer?._id === action.payload) {
        state.currentCustomer = null
      }
    },
    customerFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    clearCustomerError: (state) => {
      state.error = null
    },
    clearCurrentCustomer: (state) => {
      state.currentCustomer = null
    }
  }
})

export const {
  customerStart,
  getCustomersSuccess,
  getCustomerSuccess,
  createCustomerSuccess,
  updateCustomerSuccess,
  deleteCustomerSuccess,
  customerFailure,
  clearCustomerError,
  clearCurrentCustomer
} = customerSlice.actions

export default customerSlice.reducer