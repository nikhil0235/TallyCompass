import { useState, useEffect } from 'react'
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  Button, 
  Chip,
  Alert,
  TextField,
  IconButton,
  InputAdornment,
  Stack,
  Paper
} from '@mui/material'
import { 
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Badge as BadgeIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon
} from '@mui/icons-material'
import Layout from '../../components/common/Layout'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProfile } from '../../store/slices/profileSlice'
import userService from '../../services/userService'

const ProfilePage = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { profile, error } = useSelector((state) => state.profile)

  useEffect(() => {
    dispatch(fetchProfile())
  }, [])

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
    setPasswordError('')
  }

  const handlePasswordSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long')
      return
    }

    try {
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      setPasswordSuccess(true)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => {
        setShowPasswordForm(false)
        setPasswordSuccess(false)
      }, 2000)
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password')
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  if (error) {
    return (
      <Layout>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Layout>
    )
  }

  const currentProfile = profile || {
    userName: user?.userName || '',
    email: user?.email || '',
    profilePicture: profile?.profilePicture || null,
    function: profile?.function || '',
    designation: profile?.designation || '',
    status: profile?.status || 'active'
  }

  return (
    <Layout>
      <Box sx={{ maxWidth: '100%', mx: 'auto', p: 2 }}>
        <Stack spacing={2}>
          {/* ID Card Style Profile */}
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <Box sx={{
              position: 'absolute',
              top: -30,
              right: -30,
              width: 100,
              height: 100,
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
              borderRadius: '50%'
            }} />
            <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
              <Grid container spacing={4} alignItems="center">
                {/* Avatar Section */}
                <Grid item xs={12} sm={3} sx={{ textAlign: 'center' }}>
                  <Avatar
                    src={currentProfile.profilePicture}
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      mx: 'auto',
                      bgcolor: '#3b82f6',
                      fontSize: '2.5rem',
                      fontWeight: 600,
                      border: '3px solid white',
                      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                      mb: 2
                    }}
                  >
                    {currentProfile.userName.charAt(0).toUpperCase()}
                  </Avatar>
                  
                  <Typography variant="h5" fontWeight={700} gutterBottom sx={{ color: '#1e293b' }}>
                    {currentProfile.userName || 'User'}
                  </Typography>
                  
                  <Chip 
                    label={currentProfile.status ? currentProfile.status.toUpperCase() : 'UNKNOWN'} 
                    sx={{
                      bgcolor: currentProfile.status === 'active' ? '#dcfce7' : '#fee2e2',
                      color: currentProfile.status === 'active' ? '#166534' : '#dc2626',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      border: `1px solid ${currentProfile.status === 'active' ? '#bbf7d0' : '#fecaca'}`
                    }}
                  />
                </Grid>

                {/* Profile Details */}
                <Grid item xs={12} sm={9}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <PersonIcon sx={{ color: '#3b82f6', fontSize: 18 }} />
                          <Typography variant="body2" fontWeight={600} sx={{ color: '#3b82f6' }}>
                            Username
                          </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={600} sx={{ color: '#1e293b' }}>
                          {currentProfile.userName || 'Not specified'}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <EmailIcon sx={{ color: '#3b82f6', fontSize: 18 }} />
                          <Typography variant="body2" fontWeight={600} sx={{ color: '#3b82f6' }}>
                            Email
                          </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={600} sx={{ color: '#1e293b' }}>
                          {currentProfile.email || 'Not specified'}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <BusinessIcon sx={{ color: '#3b82f6', fontSize: 18 }} />
                          <Typography variant="body2" fontWeight={600} sx={{ color: '#3b82f6' }}>
                            Function
                          </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={600} sx={{ color: '#1e293b' }}>
                          {currentProfile.function || 'Not specified'}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <WorkIcon sx={{ color: '#3b82f6', fontSize: 18 }} />
                          <Typography variant="body2" fontWeight={600} sx={{ color: '#3b82f6' }}>
                            Experience
                          </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={600} sx={{ color: '#1e293b' }}>
                          {currentProfile.experience ? `${currentProfile.experience} years` : 'Not specified'}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <BadgeIcon sx={{ color: '#3b82f6', fontSize: 18 }} />
                          <Typography variant="body2" fontWeight={600} sx={{ color: '#3b82f6' }}>
                            Designation
                          </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={600} sx={{ color: '#1e293b' }}>
                          {currentProfile.designation || 'Not specified'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              {/* Action Button */}
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<LockIcon />}
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  sx={{ 
                    bgcolor: '#3b82f6',
                    '&:hover': { bgcolor: '#2563eb' },
                    borderRadius: 2,
                    px: 3
                  }}
                >
                  Change Password
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Password Change */}
          {showPasswordForm && (
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: '#1e293b' }}>
                  Change Password
                </Typography>
                
                {passwordSuccess && (
                  <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                    Password changed successfully!
                  </Alert>
                )}

                {passwordError && (
                  <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                    {passwordError}
                  </Alert>
                )}

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name="currentPassword"
                      label="Current Password"
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      fullWidth
                      size="small"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => togglePasswordVisibility('current')} size="small">
                              {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="newPassword"
                      label="New Password"
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      fullWidth
                      size="small"
                      helperText="Min 6 characters"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => togglePasswordVisibility('new')} size="small">
                              {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="confirmPassword"
                      label="Confirm Password"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      fullWidth
                      size="small"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => togglePasswordVisibility('confirm')} size="small">
                              {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setShowPasswordForm(false)
                          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                          setPasswordError('')
                        }}
                        size="small"
                        sx={{ borderRadius: 2 }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handlePasswordSubmit}
                        disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                        size="small"
                        sx={{ borderRadius: 2, bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
                      >
                        Update Password
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Box>
    </Layout>
  )
}

export default ProfilePage