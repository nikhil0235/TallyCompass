import { Box, Typography, Button, TextField, Paper, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { authStart, loginSuccess, signupSuccess, authFailure } from '../store/slices/authSlice'
import authService from '../services/authService'
import notify from '../utils/notify'

const HomePage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, loading } = useSelector((state) => state.auth)
  const [isLogin, setIsLogin] = useState(true)
  const [loginError, setLoginError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })

  // Real data from your database
  const data = {
    customerAnalytics: {
      customerStatus: {
        active: 3993,
        inactive: 4007
      },
      proficiencyLevels: {
        beginner: 2626,
        intermediate: 2743,
        advanced: 2631
      },
      businessTypes: [
        { type: "E-commerce Seller", count: 227 },
        { type: "Advertising Agency", count: 226 },
        { type: "Pharmacy", count: 218 },
        { type: "Courier Service", count: 218 },
        { type: "Stationery Supplier", count: 218 }
      ],
      planTypes: [
        { plan: "Rental", count: 1215 },
        { plan: "Single-User", count: 1161 },
        { plan: "Educational", count: 1151 },
        { plan: "Gold", count: 1141 },
        { plan: "Silver", count: 1131 }
      ],
      topLocations: [
        { location: "Telangana", count: 245 },
        { location: "Manipur", count: 244 },
        { location: "Tamil Nadu", count: 238 },
        { location: "Tripura", count: 237 },
        { location: "Andaman and Nicobar Islands", count: 236 }
      ]
    },
    totalCustomers: 8000,
    totalVOCs: 1200,
    totalRequests: 1800,
    totalFeedbacks: 2500
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    dispatch(authStart())
    setLoginError('')
    try {
      const userData = await authService.login({ email: formData.email, password: formData.password })
      dispatch(loginSuccess(userData))
      notify.success('Welcome back!')
      navigate('/dashboard')
    } catch (error) {
      dispatch(authFailure(error.message))
      setLoginError('You have entered wrong password')
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    dispatch(authStart())
    try {
      const userData = await authService.signup({
        username: formData.name,
        email: formData.email,
        password: formData.password
      })
      dispatch(signupSuccess(userData))
      notify.success('Account created successfully!')
      navigate('/dashboard')
    } catch (error) {
      dispatch(authFailure(error.message))
      notify.error(error.message || 'Signup failed')
    }
  }

  if (isAuthenticated) {
    navigate('/dashboard')
    return null
  }

  return (
    <Box sx={{ 
      height: '100vh', 
      width: '100vw',
      display: 'flex', 
      margin: 0, 
      padding: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden'
    }}>
      {/* Left Side - Charts and Analytics */}
      <Box sx={{ 
        flex: 2, 
        bgcolor: '#f8f9fa', 
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        margin: 0,
        height: '100vh',
        overflow: 'auto',
        pt: 1
      }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1, color: '#667eea', fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
          TallyCompass
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Voice of Customer Analytics Dashboard
        </Typography>

        {/* Key Metrics Row */}
        <Grid container spacing={2} sx={{ mb: 3, justifyContent: 'center' }}>
          <Grid item xs={3}>
            <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: '#e3f2fd', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h5" fontWeight={600} color="#1976d2">
                {data.totalCustomers.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Customers
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: '#e8f5e8', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h5" fontWeight={600} color="#388e3c">
                {data.totalVOCs.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total VOCs
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: '#fff3e0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h5" fontWeight={600} color="#f57c00">
                {data.totalRequests.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Requests
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: '#fce4ec', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h5" fontWeight={600} color="#c2185b">
                {data.totalFeedbacks.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Feedbacks
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
          {/* Customer Activity Pie Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 250, height: 250 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>Customer Activity</Typography>
              <Box sx={{ 
                width: 120, 
                height: 120, 
                borderRadius: '50%',
                background: `conic-gradient(
                  #4caf50 0deg ${(data.customerAnalytics.customerStatus.active/data.totalCustomers)*360}deg, 
                  #f44336 ${(data.customerAnalytics.customerStatus.active/data.totalCustomers)*360}deg 360deg
                )`,
                mx: 'auto',
                mb: 2,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  bgcolor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}>
                  <Typography variant="body2" fontWeight={600}>
                    {Math.round((data.customerAnalytics.customerStatus.active/data.totalCustomers)*100)}%
                  </Typography>
                  <Typography variant="caption">Active</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, bgcolor: '#4caf50', borderRadius: '50%' }} />
                  <Typography variant="caption">Active ({data.customerAnalytics.customerStatus.active.toLocaleString()})</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, bgcolor: '#f44336', borderRadius: '50%' }} />
                  <Typography variant="caption">Inactive ({data.customerAnalytics.customerStatus.inactive.toLocaleString()})</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          {/* Customer Proficiency Bar Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 250, height: 250 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>Customer Proficiency</Typography>
              <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'center', gap: 1, height: 140, mt: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{ 
                    width: 30, 
                    height: (data.customerAnalytics.proficiencyLevels.beginner/3000)*100, 
                    bgcolor: '#ff9800', 
                    mb: 1,
                    borderRadius: '4px 4px 0 0'
                  }} />
                  <Typography variant="caption">Beginner</Typography>
                  <Typography variant="caption" fontWeight={600}>
                    {data.customerAnalytics.proficiencyLevels.beginner.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{ 
                    width: 30, 
                    height: (data.customerAnalytics.proficiencyLevels.intermediate/3000)*100, 
                    bgcolor: '#2196f3', 
                    mb: 1,
                    borderRadius: '4px 4px 0 0'
                  }} />
                  <Typography variant="caption">Intermediate</Typography>
                  <Typography variant="caption" fontWeight={600}>
                    {data.customerAnalytics.proficiencyLevels.intermediate.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{ 
                    width: 30, 
                    height: (data.customerAnalytics.proficiencyLevels.advanced/3000)*100, 
                    bgcolor: '#4caf50', 
                    mb: 1,
                    borderRadius: '4px 4px 0 0'
                  }} />
                  <Typography variant="caption">Advanced</Typography>
                  <Typography variant="caption" fontWeight={600}>
                    {data.customerAnalytics.proficiencyLevels.advanced.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Top Business Types */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 250, height: 250 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>Top Business Types</Typography>
              <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'center', gap: 0.5, height: 140, mt: 1 }}>
                {data.customerAnalytics.businessTypes.slice(0, 5).map((business, index) => {
                  const maxCount = Math.max(...data.customerAnalytics.businessTypes.slice(0, 5).map(b => b.count))
                  return (
                  <Box key={business.type} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <Box sx={{ 
                      width: 20, 
                      height: (business.count/maxCount)*80, 
                      bgcolor: ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3'][index], 
                      mb: 1,
                      borderRadius: '2px 2px 0 0'
                    }} />
                    <Typography variant="caption" sx={{ writingMode: 'vertical-rl', fontSize: 8 }}>
                      {business.type.split(' ')[0]}
                    </Typography>
                    <Typography variant="caption" fontSize={10}>{business.count}</Typography>
                  </Box>
                  )
                })}
              </Box>
            </Paper>
          </Grid>

          {/* Plan Types Distribution */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 250, height: 250 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>Plan Types</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                {data.customerAnalytics.planTypes.slice(0, 5).map((plan, index) => {
                  const colors = ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0']
                  return (
                    <Box key={plan.plan} sx={{ 
                      bgcolor: colors[index], 
                      color: 'white', 
                      p: 1, 
                      borderRadius: 1,
                      minWidth: 60,
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Typography variant="body2" fontWeight={600}>{plan.count}</Typography>
                      <Typography variant="caption">{plan.plan}</Typography>
                    </Box>
                  )
                })}
              </Box>
            </Paper>
          </Grid>

          {/* Top Locations */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Top Customer Locations</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                {data.customerAnalytics.topLocations.map((location, index) => (
                  <Box key={location.location} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    bgcolor: '#f5f5f5',
                    p: 1,
                    borderRadius: 1,
                    border: `2px solid ${['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0'][index]}`
                  }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%',
                      bgcolor: ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0'][index]
                    }} />
                    <Typography variant="body2" fontWeight={600}>
                      {location.location}: {location.count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Right Side - Login/Signup Form */}
      <Box sx={{ 
        flex: 1, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 0,
        margin: 0,
        height: '100vh'
      }}>
        <Box sx={{ 
          position: 'relative',
          width: '100%',
          height: '100vh',
          perspective: '1000px'
        }}>
          {/* Book Container */}
          <Box sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.8s ease-in-out',
            transform: isLogin ? 'rotateY(0deg)' : 'rotateY(-180deg)'
          }}>
            {/* Login Page (Front) */}
            <Box sx={{ 
              position: 'absolute',
              width: '100%',
              height: '100%',
              p: 6,
              backfaceVisibility: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <Box sx={{ textAlign: 'center', mb: 3, maxWidth: 300, mx: 'auto', width: '100%' }}>
                <Typography variant="h5" fontWeight={600} sx={{ mb: 1, color: 'white' }}>
                  Welcome Back
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Sign in to your account
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleLogin} sx={{ maxWidth: 300, mx: 'auto', width: '100%' }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      borderRadius: 2
                    }
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      borderRadius: 2
                    }
                  }}
                />

                {loginError && (
                  <Typography variant="body2" color="error" sx={{ mb: 3, textAlign: 'center', color: '#ffcdd2' }}>
                    {loginError}
                  </Typography>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{ 
                    mb: 3,
                    py: 2,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '2px solid rgba(255,255,255,0.3)',
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.3)',
                      border: '2px solid rgba(255,255,255,0.5)'
                    }
                  }}
                >
                  {loading ? 'Please wait...' : 'Sign In'}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Don't have an account?
                    <Button
                      variant="text"
                      onClick={() => {
                        setIsLogin(false)
                        setLoginError('')
                        setFormData({ email: '', password: '', name: '' })
                      }}
                      sx={{ ml: 1, textTransform: 'none', fontWeight: 600, color: 'white' }}
                    >
                      Sign up
                    </Button>
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Signup Page (Back) */}
            <Box sx={{ 
              position: 'absolute',
              width: '100%',
              height: '100%',
              p: 6,
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <Box sx={{ textAlign: 'center', mb: 4, maxWidth: 400, mx: 'auto', width: '100%' }}>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1, color: 'white' }}>
                  Create Account
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Join TallyCompass today
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSignup} sx={{ maxWidth: 400, mx: 'auto', width: '100%' }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      borderRadius: 2
                    }
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      borderRadius: 2
                    }
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      borderRadius: 2
                    }
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{ 
                    mb: 3,
                    py: 2,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '2px solid rgba(255,255,255,0.3)',
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.3)',
                      border: '2px solid rgba(255,255,255,0.5)'
                    }
                  }}
                >
                  {loading ? 'Please wait...' : 'Create Account'}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Already have an account?
                    <Button
                      variant="text"
                      onClick={() => {
                        setIsLogin(true)
                        setLoginError('')
                        setFormData({ email: '', password: '', name: '' })
                      }}
                      sx={{ ml: 1, textTransform: 'none', fontWeight: 600, color: 'white' }}
                    >
                      Sign in
                    </Button>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default HomePage