import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  forgotPasswordSuccess: false,
  isInitialized: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true
      state.error = null
      state.forgotPasswordSuccess = false
    },
    loginSuccess: (state, action) => {
      state.loading = false
      state.isAuthenticated = true
      state.user = action.payload
      state.isInitialized = true
    },
    signupSuccess: (state, action) => {
      state.loading = false
      state.isAuthenticated = true
      state.user = action.payload
      state.isInitialized = true
    },
    forgotPasswordSuccess: (state) => {
      state.loading = false
      state.forgotPasswordSuccess = true
    },
    authFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
      state.forgotPasswordSuccess = false
    },
    clearError: (state) => {
      state.error = null
    },
    initializeAuth: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated
      state.user = action.payload.user
      state.isInitialized = true
    }
  }
})

export const { 
  authStart, 
  loginSuccess, 
  signupSuccess, 
  forgotPasswordSuccess, 
  authFailure, 
  logout, 
  clearError,
  initializeAuth
} = authSlice.actions
export default authSlice.reducer