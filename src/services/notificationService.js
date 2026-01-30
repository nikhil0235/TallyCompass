import apiService from './api/apiService'

const notificationService = {
  getNotifications: async () => {
    try {
      const response = await apiService.get('/api/notifications', { requiresAuth: true })
      console.log('Full API response:', response);
      let notificationsRaw = [];
      if (Array.isArray(response)) {
        // API returned an array directly
        notificationsRaw = response;
        console.log('Fetched notifications (array):', notificationsRaw);
      } else if (response && Array.isArray(response.data)) {
        notificationsRaw = response.data;
        console.log('Fetched notifications (response.data array):', notificationsRaw);
      } else if (response && response.data && Array.isArray(response.data.notifications)) {
        notificationsRaw = response.data.notifications;
        console.log('Fetched notifications (response.data.notifications):', notificationsRaw);
      } else if (response && response.data && typeof response.data === 'object') {
        notificationsRaw = [response.data];
        console.log('Fetched notifications (single object):', notificationsRaw);
      } else {
        console.warn('API response did not match any expected notification format:', response);
      }
      if (!notificationsRaw || notificationsRaw.length === 0) return [];
      const notifications = notificationsRaw.map((n, idx) => ({
        id: n && n._id ? n._id : idx + 1,
        title: n && n.type === 'mention' ? 'New Feedback Assigned' : (n && n.type) || 'Notification',
        message: n && n.description ? n.description : '',
        link: n && n.resourceModel === 'Feedback' ? '/feedback' : '/',
        read: n && typeof n.isRead === 'boolean' ? n.isRead : false,
        createdAt: n && n.createdAt ? n.createdAt : new Date().toISOString(),
        toUser: n && n.toUser,
        fromUser: n && n.fromUser,
        resourceId: n && n.resourceId,
        resourceModel: n && n.resourceModel
      }));
      return notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error)
      // Return mock data for now
      return [
        {
          id: 1,
          title: 'New Customer Added',
          message: 'A new customer has been added to your system',
          link: '/customers',
          read: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Product Update',
          message: 'Product inventory has been updated',
          link: '/products',
          read: false,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 3,
          title: 'VOC Project Completed',
          message: 'Customer feedback collection for Project Alpha has been completed',
          link: '/voc',
          vocId: 'voc123',
          read: false,
          createdAt: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 4,
          title: 'New VOC Response',
          message: 'New customer response received for Beta Project',
          link: '/voc',
          vocId: 'voc456',
          read: true,
          createdAt: new Date(Date.now() - 10800000).toISOString()
        }
      ]
    }
  },

  markAsRead: async (notificationId) => {
    try {
      await apiService.put(`/api/notifications/${notificationId}/read`, undefined, { requiresAuth: true })
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }
}

export default notificationService