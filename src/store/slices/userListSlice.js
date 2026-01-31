import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from '../../services/userService'

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk(
  'userList/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getAll()
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const userListSlice = createSlice({
  name: 'userList',
  initialState: {
    users: [],
    loading: false,
    error: null
  },
  reducers: {
    setUsers: (state, action) => {
      console.log('setUsers reducer called with:', action.payload)
      console.log('Current state before update:', state.users)
      state.users = action.payload
      console.log('State after update:', state.users)
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        console.log('fetchUsers.fulfilled called with:', action.payload)
        console.log('Current state before update:', state.users)
        state.loading = false
        state.users = action.payload
        console.log('State after update:', state.users)
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { setUsers, setLoading, setError } = userListSlice.actions

export default userListSlice.reducer