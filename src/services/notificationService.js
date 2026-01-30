import apiService from './api/apiService'

const notificationService = {
  getNotifications: async () => {
    try {
      const response = await apiService.get('/notifications')
      return response.data
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
      await apiService.put(`/notifications/${notificationId}/read`)
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }
}

export default notificationService