import { Box, useMediaQuery, useTheme } from '@mui/material'
import { useSelector } from 'react-redux'
import Sidebar from './Sidebar'
import Header from './Header'
import ChatButton from './ChatButton'

const Layout = ({ children }) => {
  const { sidebarOpen } = useSelector((state) => state.ui)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0
        }}
      >
        <Header />
        <Box 
          sx={{ 
            flexGrow: 1, 
            p: { xs: 2, sm: 3 }, 
            bgcolor: '#f5f5f5',
            minHeight: 'calc(100vh - 64px)',
            width: '100%'
          }}
        >
          {children}
        </Box>
      </Box>
      <ChatButton />
    </Box>
  )
}

export default Layout