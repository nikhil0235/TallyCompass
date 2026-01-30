import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem, useMediaQuery, useTheme, Badge } from '@mui/material'
import { AccountCircle, Logout, Menu as MenuIcon, Notifications } from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { logout } from '../../store/slices/authSlice'
import { toggleSidebar } from '../../store/slices/uiSlice'
import { toggleNotificationPanel, setNotifications } from '../../store/slices/notificationSlice'
import { useState, useEffect } from 'react'
import authService from '../../services/authService'
import notificationService from '../../services/notificationService'
import NotificationPanel from './NotificationPanel'

const Header = () => {
  const { user } = useSelector((state) => state.auth)
  const { unreadCount } = useSelector((state) => state.notification)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [anchorEl, setAnchorEl] = useState(null)

  const getPageTitle = () => {
    const path = location.pathname
    if (path.includes('/requests')) return 'Customer Requests'
    if (path.includes('/feedback')) return 'Customer Feedback'
    if (path.includes('/customers')) return 'Customers'
    if (path.includes('/products')) return 'Products'
    if (path.includes('/dashboard')) return 'Dashboard'
    if (path.includes('/voc')) return 'Voice of Customer'
    if (path.includes('/profile')) return 'Profile'
    return 'TallyCompass'
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      const notifications = await notificationService.getNotifications()
      dispatch(setNotifications(notifications))
    }
    fetchNotifications()
  }, [])

  const handleNotificationClick = () => {
    dispatch(toggleNotificationPanel())
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    dispatch(logout())
    handleClose()
  }

  return (
    <AppBar 
      position="static" 
      elevation={1}
      sx={{ 
        bgcolor: 'white', 
        color: 'text.primary',
        width: '100%'
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => dispatch(toggleSidebar())}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 600,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {getPageTitle()}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'relative' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              display: { xs: 'none', sm: 'block' }
            }}
          >
            {user?.userName}
          </Typography>
          
          <IconButton
            size="large"
            onClick={handleNotificationClick}
            color="inherit"
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          
          <NotificationPanel />
          
          <IconButton
            size="large"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header