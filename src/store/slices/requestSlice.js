import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  requests: [],
  currentRequest: null,
  loading: false,
  error: null
}

const requestSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    requestStart: (state) => {
      state.loading = true
      state.error = null
    },
    getRequestsSuccess: (state, action) => {
      state.loading = false
      state.requests = action.payload
    },
    getRequestSuccess: (state, action) => {
      state.loading = false
      state.currentRequest = action.payload
    },
    createRequestSuccess: (state, action) => {
      state.loading = false
      state.requests.push(action.payload)
    },
    updateRequestSuccess: (state, action) => {
      state.loading = false
      const index = state.requests.findIndex(req => req.id === action.payload.id)
      if (index !== -1) {
        state.requests[index] = action.payload
      }
    },
    deleteRequestSuccess: (state, action) => {
      state.loading = false
      state.requests = state.requests.filter(req => req.id !== action.payload)
    },
    requestFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    }
  }
})

export const {
  requestStart,
  getRequestsSuccess,
  getRequestSuccess,
  createRequestSuccess,
  updateRequestSuccess,
  deleteRequestSuccess,
  requestFailure
} = requestSlice.actions

export default requestSlice.reducer