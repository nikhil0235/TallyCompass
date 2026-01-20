import { useState } from 'react'
import { Button, TextField, Box, Alert } from '@mui/material'

const SignupForm = ({ onSubmit, loading = false, error = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
    onSubmit({ name: formData.name, email: formData.email, password: formData.password })
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        label="Full Name"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        type="email"
        label="Email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        type="password"
        label="Password"
        value={formData.password}
        onChange={(e) => handleChange('password', e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        type="password"
        label="Confirm Password"
        value={formData.confirmPassword}
        onChange={(e) => handleChange('confirmPassword', e.target.value)}
        error={!!passwordError}
        helperText={passwordError}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading || !!passwordError}
        sx={{ mt: 3, mb: 2 }}
      >
        {loading ? 'Creating Account...' : 'Sign Up'}
      </Button>
      {error && <Alert severity="error">{error}</Alert>}
    </Box>
  )
}

export default SignupForm