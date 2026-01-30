import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  vocs: [],
  loading: false,
  error: null
}

const vocSlice = createSlice({
  name: 'voc',
  initialState,
  reducers: {
    vocRequest: (state) => {
      state.loading = true
      state.error = null
    },
    vocSuccess: (state, action) => {
      state.loading = false
      state.vocs = action.payload
    },
    createVocSuccess: (state, action) => {
      state.loading = false
      state.vocs.push(action.payload)
    },
    updateVocSuccess: (state, action) => {
      state.loading = false
      const index = state.vocs.findIndex(voc => voc._id === action.payload._id)
      if (index !== -1) {
        state.vocs[index] = action.payload
      }
    },
    deleteVocSuccess: (state, action) => {
      state.loading = false
      state.vocs = state.vocs.filter(voc => voc._id !== action.payload)
    },
    vocFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    }
  }
})

export const {
  vocRequest,
  vocSuccess,
  createVocSuccess,
  updateVocSuccess,
  deleteVocSuccess,
  vocFailure
} = vocSlice.actions

export default vocSlice.reducer