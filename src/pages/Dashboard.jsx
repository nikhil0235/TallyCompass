import { Container, Typography, Box, Button } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/slices/authSlice'
import authService from '../services/authService'
import { Logout as LogoutIcon } from '@mui/icons-material'

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      dispatch(logout())
      navigate('/login')
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight={700}>
          TallyCompass Dashboard
        </Typography>
        <Button 
          onClick={handleLogout} 
          variant="outlined" 
          startIcon={<LogoutIcon />}
        >
          Logout
        </Button>
      </Box>
      
      <Typography variant="h6" color="text.secondary">
        Welcome to your customer feedback management system
      </Typography>
    </Container>
  )
}

export default Dashboard