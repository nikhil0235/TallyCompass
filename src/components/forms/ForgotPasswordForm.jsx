import { useState } from 'react'
import { Button, TextField, Box, Alert } from '@mui/material'

const ForgotPasswordForm = ({ onSubmit, loading = false, error = null, success = false }) => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ email })
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        type="email"
        label="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        helperText="Enter your email to receive password reset instructions"
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{ mt: 3, mb: 2 }}
      >
        {loading ? 'Sending...' : 'Send Reset Link'}
      </Button>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Password reset link sent to your email!</Alert>}
    </Box>
  )
}

export default ForgotPasswordForm