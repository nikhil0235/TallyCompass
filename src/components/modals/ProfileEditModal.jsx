import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Avatar,
  IconButton,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile, uploadProfilePicture, clearError, clearUpdateSuccess } from '../../store/slices/profileSlice'

const ProfileEditModal = ({ open, onClose, profile, onUpdate, functionOptions }) => {
  const dispatch = useDispatch()
  const { updating, error, updateSuccess } = useSelector((state) => state.profile)
  
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    function: 'PM',
    designation: ''
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)

  useEffect(() => {
    if (profile) {
      setFormData({
        userName: profile.userName || '',
        email: profile.email || '',
        function: profile.function || 'PM',
        designation: profile.designation || ''
      })
      setAvatarPreview(profile.profilePicture)
    }
  }, [profile])

  useEffect(() => {
    if (updateSuccess) {
      onUpdate()
      dispatch(clearUpdateSuccess())
    }
  }, [updateSuccess, onUpdate, dispatch])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Update profile data
      await dispatch(updateProfile(formData)).unwrap()
      
      // Upload avatar if changed
      if (avatarFile) {
        const formDataAvatar = new FormData()
        formDataAvatar.append('profilePicture', avatarFile)
        await dispatch(uploadProfilePicture(formDataAvatar)).unwrap()
      }
    } catch (err) {
      // Error is handled by Redux
    }
  }

  const handleClose = () => {
    if (profile) {
      setFormData({
        userName: profile.userName || '',
        email: profile.email || '',
        function: profile.function || 'PM',
        designation: profile.designation || ''
      })
      setAvatarPreview(profile.profilePicture)
    }
    setAvatarFile(null)
    dispatch(clearError())
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {/* Avatar Upload */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={avatarPreview}
                sx={{ 
                  width: 100, 
                  height: 100,
                  bgcolor: 'primary.main',
                  fontSize: '2rem'
                }}
              >
                {formData.userName.charAt(0).toUpperCase()}
              </Avatar>
              <IconButton
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: -8,
                  right: -8,
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  }
                }}
                size="small"
              >
                <PhotoCameraIcon fontSize="small" />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </IconButton>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="userName"
                label="Username"
                value={formData.userName}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Function</InputLabel>
                <Select
                  name="function"
                  value={formData.function}
                  onChange={handleInputChange}
                  label="Function"
                >
                  {functionOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="designation"
                label="Designation"
                value={formData.designation}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={updating}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={updating}
          >
            {updating ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ProfileEditModal