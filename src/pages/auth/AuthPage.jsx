import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  authStart, 
  loginSuccess, 
  signupSuccess, 
  forgotPasswordSuccess, 
  authFailure 
} from '../../store/slices/authSlice'
import authService from '../../services/authService'
import LoginForm from '../../components/forms/LoginForm'
import SignupForm from '../../components/forms/SignupForm'
import ForgotPasswordForm from '../../components/forms/ForgotPasswordForm'
import { 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Box, 
  Avatar,
  Divider,
  Chip
} from '@mui/material'
import { LockOutlined, Business } from '@mui/icons-material'
import notify from '../../utils/notify'

const AuthPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [loginError, setLoginError] = useState('')
  const { loading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  // Set mode based on URL
  useEffect(() => {
    const path = location.pathname
    if (path === '/signup') setMode('signup')
    else if (path === '/forgot-password') setMode('forgot')
    else setMode('login')
  }, [location.pathname])

  // Update URL when mode changes
  const handleModeChange = (newMode) => {
    setMode(newMode)
    const routes = {
      login: '/login',
      signup: '/signup',
      forgot: '/forgot-password'
    }
    navigate(routes[newMode])
  }

  const handleLogin = async (credentials) => {
    dispatch(authStart())
    setLoginError('')
    try {
      const userData = await authService.login(credentials)
      dispatch(loginSuccess(userData))
      notify.success('Welcome back!')
      navigate('/dashboard')
    } catch (error) {
      dispatch(authFailure(error.message))
      setLoginError('You have entered wrong password')
    }
  }

  const handleSignup = async (userData) => {
    dispatch(authStart())
    try {
      const backendData = {
        username: userData.name,
        email: userData.email,
        password: userData.password
      }
      const response = await authService.signup(backendData)
      dispatch(signupSuccess(response))
      notify.success('Account created successfully!')
      navigate('/dashboard')
    } catch (error) {
      dispatch(authFailure(error.message))
      notify.error(error.message || 'Signup failed')
    }
  }

  const handleForgotPassword = async (email) => {
    dispatch(authStart())
    try {
      await authService.forgotPassword(email)
      dispatch(forgotPasswordSuccess())
      notify.success('Password reset link sent!')
    } catch (error) {
      dispatch(authFailure(error.message))
      notify.error(error.message || 'Failed to send reset link')
    }
  }

  const renderForm = () => {
    switch (mode) {
      case 'signup':
        return <SignupForm onSubmit={handleSignup} loading={loading} />
      case 'forgot':
        return <ForgotPasswordForm onSubmit={handleForgotPassword} loading={loading} />
      default:
        return <LoginForm onSubmit={handleLogin} loading={loading} />
    }
  }

  const getTitle = () => {
    switch (mode) {
      case 'signup': return 'Create Account'
      case 'forgot': return 'Reset Password'
      default: return 'Welcome Back'
    }
  }

  const getSubtitle = () => {
    switch (mode) {
      case 'signup': return 'Join TallyCompass today'
      case 'forgot': return 'We\'ll send you a reset link'
      default: return 'Sign in to your account'
    }
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
        justifyContent: 'center',
        margin: 0,
        padding: 0
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 420,
          mx: 'auto',
          px: 2
        }}
      >
        <Paper 
          elevation={0}
          sx={{ 
            p: 5,
            borderRadius: 3,
            background: '#ffffff',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              component="h1" 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: '#1a1a1a',
                mb: 1
              }}
            >
              {getTitle()}
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ fontSize: '1rem' }}
            >
              {getSubtitle()}
            </Typography>
          </Box>

          {/* Form */}
          {renderForm()}

          {/* Login Error */}
          {mode === 'login' && loginError && (
            <Typography 
              variant="body2" 
              color="error" 
              sx={{ 
                textAlign: 'center', 
                mt: 2, 
                mb: 1,
                fontSize: '0.875rem'
              }}
            >
              {loginError}
            </Typography>
          )}

          {/* Navigation Links */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            {mode === 'login' && (
              <>
                <Button 
                  variant="text" 
                  onClick={() => handleModeChange('forgot')}
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    mb: 2,
                    display: 'block'
                  }}
                >
                  Forgot your password?
                </Button>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Button 
                    variant="text" 
                    onClick={() => handleModeChange('signup')}
                    sx={{ 
                      textTransform: 'none', 
                      p: 0, 
                      minWidth: 'auto',
                      fontWeight: 600
                    }}
                  >
                    Sign up
                  </Button>
                </Typography>
              </>
            )}
            
            {mode === 'signup' && (
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Button 
                  variant="text" 
                  onClick={() => handleModeChange('login')}
                  sx={{ 
                    textTransform: 'none', 
                    p: 0, 
                    minWidth: 'auto',
                    fontWeight: 600
                  }}
                >
                  Sign in
                </Button>
              </Typography>
            )}
            
            {mode === 'forgot' && (
              <Button 
                variant="text" 
                onClick={() => handleModeChange('login')}
                sx={{ 
                  textTransform: 'none',
                  fontSize: '0.9rem'
                }}
              >
                ← Back to Sign In
              </Button>
            )}
          </Box>

        </Paper>
      </Box>
    </Box>
  )
}

export default AuthPage