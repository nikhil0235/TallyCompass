import { Box, Container, Typography, Button, Grid, Card, CardContent } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { 
  Feedback, 
  Analytics, 
  TrendingUp, 
  People, 
  ArrowForward 
} from '@mui/icons-material'

const HomePage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <Box>
      {/* Navigation */}
      <Box sx={{ 
        position: 'fixed', 
        top: 0, 
        width: '100%', 
        bgcolor: 'white', 
        zIndex: 1000,
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            py: 2 
          }}>
            <Typography variant="h5" fontWeight={700} color="#667eea">
              TallyCompass
            </Typography>
            <Box>
              {isAuthenticated ? (
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/dashboard')}
                  sx={{ 
                    bgcolor: '#667eea',
                    '&:hover': { bgcolor: '#5a6fd8' }
                  }}
                >
                  Dashboard
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    variant="text" 
                    onClick={() => navigate('/login')}
                    sx={{ color: '#667eea' }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/signup')}
                    sx={{ 
                      bgcolor: '#667eea',
                      '&:hover': { bgcolor: '#5a6fd8' }
                    }}
                  >
                    Get Started
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        pt: 12,
        pb: 8
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h2" fontWeight={700} sx={{ mb: 3 }}>
              Transform Customer Feedback into Business Growth
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Collect, analyze, and act on customer feedback with TallyCompass
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
              sx={{ 
                bgcolor: 'white',
                color: '#667eea',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Start Free Trial'}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
            Everything you need for VOC management
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Powerful tools to capture, understand, and act on customer feedback
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Feedback sx={{ fontSize: 40, color: '#667eea', mb: 2 }} />
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                Collect Feedback
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Gather customer insights from multiple channels
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Analytics sx={{ fontSize: 40, color: '#667eea', mb: 2 }} />
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                Analyze Insights
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Transform feedback into actionable insights
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: '#667eea', mb: 2 }} />
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                Track Trends
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Monitor customer sentiment over time
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <People sx={{ fontSize: 40, color: '#667eea', mb: 2 }} />
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                Team Collaboration
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Share insights across teams
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ 
        bgcolor: '#1a1a1a',
        color: 'white',
        py: 4
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}>
            <Typography variant="h6" fontWeight={600}>
              TallyCompass
            </Typography>
            <Typography variant="body2" color="text.secondary">
              © 2024 TallyCompass. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default HomePage