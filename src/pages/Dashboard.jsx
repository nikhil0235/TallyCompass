import { Container, Typography, Box, Button, Avatar, Menu, MenuItem } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { logout } from '../store/slices/authSlice'
import authService from '../services/authService'
import { 
  Logout as LogoutIcon, 
  Person as PersonIcon
} from '@mui/icons-material'

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleProfileClick = () => {
    navigate('/profile')
    handleProfileMenuClose()
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      dispatch(logout())
      navigate('/login')
      handleProfileMenuClose()
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight={700}>
          TallyCompass Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ bgcolor: '#667eea', cursor: 'pointer' }}
            onClick={handleProfileMenuOpen}
          >
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleProfileClick}>
              <PersonIcon sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Voice of Customer Management System
      </Typography>

      <Typography variant="h5" fontWeight={600}>
        VOC List
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Your customer feedback will appear here.
      </Typography>
    </Container>
  )
}

export default Dashboard