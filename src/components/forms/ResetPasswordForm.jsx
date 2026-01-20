import { useState } from 'react'
import { Button, TextField, Box, Alert } from '@mui/material'

const ResetPasswordForm = ({ onSubmit, loading = false, error = null }) => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (field === 'confirmPassword' || field === 'password') {
      const password = field === 'password' ? value : formData.password
      const confirmPassword = field === 'confirmPassword' ? value : formData.confirmPassword
      
      if (confirmPassword && password !== confirmPassword) {
        setPasswordError('Passwords do not match')
      } else {
        setPasswordError('')
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    onSubmit({ password: formData.password })
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        margin="normal"
        required
        fullWidth
        type="password"
        label="New Password"
        value={formData.password}
        onChange={(e) => handleChange('password', e.target.value)}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          }
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        type="password"
        label="Confirm New Password"
        value={formData.confirmPassword}
        onChange={(e) => handleChange('confirmPassword', e.target.value)}
        error={!!passwordError}
        helperText={passwordError}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          }
        }}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading || !!passwordError}
        sx={{ 
          mt: 2,
          py: 2,
          borderRadius: 3,
          textTransform: 'none',
          fontSize: '1.1rem',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4c93 100%)',
            boxShadow: '0 12px 35px rgba(102, 126, 234, 0.5)',
            transform: 'translateY(-2px)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        {loading ? 'Resetting Password...' : 'Reset Password'}
      </Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  )
}

export default ResetPasswordForm