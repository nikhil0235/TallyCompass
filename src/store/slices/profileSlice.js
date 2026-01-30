import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from '../../services/userService'

// Async thunks
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getProfile()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile')
    }
  }
)

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await userService.updateProfile(profileData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile')
    }
  }
)

export const uploadProfilePicture = createAsyncThunk(
  'profile/uploadProfilePicture',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await userService.uploadProfilePicture(formData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload profile picture')
    }
  }
)

const initialState = {
  profile: null,
  loading: false,
  updating: false,
  error: null,
  updateSuccess: false
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false
    },
    resetProfile: (state) => {
      return initialState
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.updating = true
        state.error = null
        state.updateSuccess = false
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updating = false
        state.profile = { ...state.profile, ...action.payload }
        state.updateSuccess = true
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updating = false
        state.error = action.payload
      })
      
      // Upload Profile Picture
      .addCase(uploadProfilePicture.pending, (state) => {
        state.updating = true
        state.error = null
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        state.updating = false
        if (state.profile) {
          state.profile.profilePicture = action.payload.profilePicture
        }
        state.updateSuccess = true
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.updating = false
        state.error = action.payload
      })
  }
})

export const { clearError, clearUpdateSuccess, resetProfile } = profileSlice.actions
export default profileSlice.reducer