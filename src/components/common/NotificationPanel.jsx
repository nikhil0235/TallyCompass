import { 
  Box, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  IconButton,
  Chip
} from '@mui/material'
import { Close, Circle } from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { markAsRead, closeNotificationPanel } from '../../store/slices/notificationSlice'
import { openModal } from '../../store/slices/uiSlice'
import notificationService from '../../services/notificationService'

const NotificationPanel = () => {
  const { notifications, isOpen } = useSelector((state) => state.notification)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      dispatch(markAsRead(notification.id))
      await notificationService.markAsRead(notification.id)
    }
    
    if (notification.link) {
      navigate(notification.link)
      
      // If it's a VOC notification with vocId, open the specific VOC detail
      if (notification.vocId && notification.link === '/voc') {
        setTimeout(() => {
          dispatch(openModal({ 
            modalName: 'detailModal', 
            data: { type: 'voc', vocId: notification.vocId } 
          }))
        }, 100)
      }
    }
    
    dispatch(closeNotificationPanel())
  }

  const handleClose = () => {
    dispatch(closeNotificationPanel())
  }

  if (!isOpen) return null

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'absolute',
        top: '100%',
        right: 0,
        width: 350,
        maxHeight: 400,
        overflow: 'hidden',
        zIndex: 1300,
        mt: 1
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Notifications</Typography>
        <IconButton size="small" onClick={handleClose}>
          <Close />
        </IconButton>
      </Box>
      <Divider />
      
      {notifications.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No notifications
          </Typography>
        </Box>
      ) : (
        <List sx={{ maxHeight: 300, overflow: 'auto', p: 0 }}>
          {notifications.map((notification, index) => (
            <Box key={notification.id}>
              <ListItem
                button
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                  bgcolor: notification.read ? 'transparent' : 'action.selected'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                  {!notification.read && (
                    <Circle sx={{ fontSize: 8, color: 'primary.main', mt: 1, mr: 1 }} />
                  )}
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              </ListItem>
              {index < notifications.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      )}
    </Paper>
  )
}

export default NotificationPanel