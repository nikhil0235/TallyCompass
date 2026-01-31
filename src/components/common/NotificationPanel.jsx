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
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { markAsRead, closeNotificationPanel, addNotification } from '../../store/slices/notificationSlice'
import { openModal } from '../../store/slices/uiSlice'
import notificationService from '../../services/notificationService'
import socket from '../../services/socket'

const NotificationPanel = () => {
  const { notifications, isOpen } = useSelector((state) => state.notification)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Real-time notification listener
  useEffect(() => {
    socket.on('new-notification', (notification) => {
      // Normalize notification to match API format
      const normalized = {
        id: notification._id || notification.id,
        title: notification.type === 'mention' ? 'New Feedback Assigned' : (notification.type || 'Notification'),
        message: notification.description || '',
        link: notification.resourceModel === 'Feedback' ? '/feedback' : '/',
        read: typeof notification.isRead === 'boolean' ? notification.isRead : false,
        createdAt: notification.createdAt || new Date().toISOString(),
        toUser: notification.toUser,
        fromUser: notification.fromUser,
        resourceId: notification.resourceId,
        resourceModel: notification.resourceModel
      };
      dispatch(addNotification(normalized));
    });
    return () => {
      socket.off('new-notification');
    };
  }, [dispatch]);

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      dispatch(markAsRead(notification.id))
      await notificationService.markAsRead(notification.id)
    }
    
    // Feedback: go to /feedback/:id
    if (notification.resourceModel === 'Feedback' && notification.resourceId) {
      navigate(`/feedback/${notification.resourceId}`);
    // VOC: go to /voc/:id
    } else if (notification.resourceModel === 'VOC' && notification.resourceId) {
      navigate(`/voc/${notification.resourceId}`);
    // CustomerRequest: go to /requests/:id
    } else if (notification.resourceModel === 'CustomerRequest' && notification.resourceId) {
      navigate(`/requests/${notification.resourceId}`);
    } else if (notification.link) {
      navigate(notification.link);
    }
    dispatch(closeNotificationPanel());
  }

  const handleClose = () => {
    dispatch(closeNotificationPanel())
  }

  if (!isOpen) return null

  // Sort: unread first, then read, newest first within each group
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.read === b.read) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return a.read ? 1 : -1;
  });

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
        <List sx={{ maxHeight: 300, overflowY: 'auto', p: 0 }}>
          {sortedNotifications.map((notification, index) => (
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
                      <span>
                        <span style={{ display: 'block', marginBottom: 4, color: 'rgba(0,0,0,0.6)', fontSize: '0.875rem' }}>
                          {notification.message}
                        </span>
                        <Typography variant="caption" color="text.secondary" component="span">
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>
                      </span>
                    }
                  />
                </Box>
              </ListItem>
              {index < sortedNotifications.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      )}
    </Paper>
  )
}

export default NotificationPanel