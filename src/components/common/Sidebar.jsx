import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { toggleSidebar, closeSidebar } from '../../store/slices/uiSlice'
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory as ProductIcon,
  Search as SearchIcon,
  Feedback as FeedbackIcon,
  RecordVoiceOver as VocIcon,
  Assignment as RequestIcon,
  Menu as MenuIcon,
  Person as ProfileIcon
} from '@mui/icons-material'

const menuItems = [
  { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'VOC', icon: <VocIcon />, path: '/voc' },
  { text: 'Requests', icon: <RequestIcon />, path: '/requests' },
  { text: 'Feedback', icon: <FeedbackIcon />, path: '/feedback' },
  { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
  { text: 'Products', icon: <ProductIcon />, path: '/products' },
]

const Sidebar = () => {
  const { sidebarOpen } = useSelector((state) => state.ui)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleNavigation = (path) => {
    navigate(path)
    if (isMobile) {
      dispatch(closeSidebar())
    }
  }

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? sidebarOpen : true}
      onClose={() => dispatch(closeSidebar())}
      sx={{
        width: sidebarOpen ? 240 : 60,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: sidebarOpen ? 240 : 60,
          boxSizing: 'border-box',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          zIndex: theme.zIndex.drawer
        }
      }}
    >
      <Box sx={{ 
        p: sidebarOpen ? 2 : 0, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: sidebarOpen ? 'flex-start' : 'center',
        minHeight: 64,
        gap: sidebarOpen ? 1 : 0
      }}>
        <IconButton 
          onClick={() => dispatch(toggleSidebar())} 
          sx={{ 
            p: 1,
            mx: sidebarOpen ? 0 : 'auto'
          }}
        >
          <MenuIcon />
        </IconButton>
        {sidebarOpen && (
          <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
            TallyCompass
          </Typography>
        )}
      </Box>
      
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            button
            selected={location.pathname === item.path}
            onClick={() => handleNavigation(item.path)}
            sx={{ px: sidebarOpen ? 2 : 0, justifyContent: sidebarOpen ? 'flex-start' : 'center' }}
          >
            <ListItemIcon sx={{ minWidth: sidebarOpen ? 56 : 'auto' }}>
              {item.icon}
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary={item.text} />}
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

export default Sidebar