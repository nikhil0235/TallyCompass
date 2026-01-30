import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  query: '',
  results: null,
  sources: [],
  loading: false,
  error: null,
  history: []
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    searchStart: (state, action) => {
      state.loading = true
      state.error = null
      state.query = action.payload
    },
    searchSuccess: (state, action) => {
      state.loading = false
      state.results = action.payload.answer
      state.sources = action.payload.sources || []
      // Add to history
      if (state.query && !state.history.some(h => h.query === state.query)) {
        state.history.unshift({
          query: state.query,
          answer: action.payload.answer,
          timestamp: new Date().toISOString()
        })
        // Keep only last 10 searches
        state.history = state.history.slice(0, 10)
      }
    },
    searchFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    clearSearch: (state) => {
      state.query = ''
      state.results = null
      state.sources = []
      state.error = null
    },
    clearSearchError: (state) => {
      state.error = null
    },
    setQuery: (state, action) => {
      state.query = action.payload
    }
  }
})

export const {
  searchStart,
  searchSuccess,
  searchFailure,
  clearSearch,
  clearSearchError,
  setQuery
} = searchSlice.actions

export default searchSlice.reducer