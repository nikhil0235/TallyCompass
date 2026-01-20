import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { authStart, authFailure } from '../../store/slices/authSlice'
import authService from '../../services/authService'
import ResetPasswordForm from '../../components/forms/ResetPasswordForm'
import { Box, Paper, Typography } from '@mui/material'
import { Business } from '@mui/icons-material'
import notify from '../../utils/notify'

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)
  
  const token = searchParams.get('token')
  console.log('Token from URL:', token)

  const handleResetPassword = async (passwordData) => {
    if (!token) {
      notify.error('Invalid reset token')
      return
    }

    dispatch(authStart())
    try {
      await authService.resetPassword({ 
        token, 
        password: passwordData.password 
      })
      notify.success('Password reset successfully!')
      navigate('/login')
    } catch (error) {
      dispatch(authFailure(error.message))
      notify.error(error.message || 'Password reset failed')
    }
  }

  if (!token) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
          <Typography variant="h5" color="error" mb={2}>
            Invalid Reset Link
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            This password reset link is invalid or missing a token.
          </Typography>
          <Typography 
            variant="body2" 
            color="primary" 
            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => navigate('/forgot-password')}
          >
            Request a new reset link
          </Typography>
        </Paper>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 420, px: 2 }}>
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Reset Password
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Enter your new password below
            </Typography>
          </Box>

          <ResetPasswordForm 
            onSubmit={handleResetPassword}
            loading={loading}
          />
        </Paper>
      </Box>
    </Box>
  )
}

export default ResetPasswordPage