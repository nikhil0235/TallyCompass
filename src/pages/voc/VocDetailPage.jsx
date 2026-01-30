import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Button,
  Grid,
  Divider,
  LinearProgress,
  useTheme,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Tooltip,
  Badge,
  Link
} from '@mui/material'
import {
  ArrowBack as BackIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  Assignment as ProjectIcon,
  Feedback as FeedbackIcon,
  RequestPage as RequestIcon,
  Inventory as ProductIcon,
  Image as MediaIcon,
  PlayArrow as VideoIcon,
  Description as DocumentIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  OpenInNew as OpenIcon
} from '@mui/icons-material'
import Layout from '../../components/common/Layout'
import customerService from '../../services/customerService'
import feedbackService from '../../services/feedbackService'
import productService from '../../services/productService'

const VocDetailPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const voc = location.state?.voc
  
  const [customerDetails, setCustomerDetails] = useState(null)
  const [feedbacks, setFeedbacks] = useState([])
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchRelatedData = async () => {
      if (!voc) return
      
      setLoading(true)
      try {
        const promises = []
        
        // Fetch customer details
        if (voc.customerDetailsObj?.customerID) {
          promises.push(
            customerService.getById(voc.customerDetailsObj.customerID)
              .then(res => setCustomerDetails(res.data))
              .catch(() => setCustomerDetails(null))
          )
        }
        
        // Fetch feedbacks
        if (voc.customerDetailsObj?.feedbackID?.length > 0) {
          const feedbackPromises = voc.customerDetailsObj.feedbackID.map(id => 
            feedbackService.getById(id).catch(() => null)
          )
          promises.push(
            Promise.all(feedbackPromises)
              .then(results => setFeedbacks(results.filter(Boolean).map(r => r.data)))
          )
        }
        
        // Fetch product details
        if (voc.ProductID) {
          promises.push(
            productService.getById(voc.ProductID)
              .then(res => setProduct(res.data))
              .catch(() => setProduct(null))
          )
        }
        
        await Promise.all(promises)
      } catch (error) {
        console.error('Error fetching related data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedData()
  }, [voc])

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success'
      case 'ongoing': return 'warning'
      case 'upcoming': return 'info'
      case 'cancelled': return 'error'
      default: return 'default'
    }
  }

  const getCustomerStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success'
      case 'pending': return 'warning'
      case 'cancelled': return 'error'
      default: return 'default'
    }
  }

  const getProgressPercentage = (status) => {
    const progress = {
      upcoming: 0,
      ongoing: 50,
      completed: 100,
      cancelled: 0
    }
    return progress[status?.toLowerCase()] || 0
  }

  const formatDate = (date) => {
    if (!date) return 'Not specified'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDuration = () => {
    if (!voc?.vocStartDate || !voc?.vocEndDate) return 'Not specified'
    const start = new Date(voc.vocStartDate)
    const end = new Date(voc.vocEndDate)
    const diffMs = end - start
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    return `${diffDays} days`
  }

  const getMediaIcon = (mediaType) => {
    switch (mediaType?.toLowerCase()) {
      case 'image': return <MediaIcon />
      case 'video': return <VideoIcon />
      case 'document': return <DocumentIcon />
      default: return <MediaIcon />
    }
  }

  if (!voc) {
    navigate('/voc')
    return null
  }

  return (
    <Layout>
      <Box sx={{ pb: 4 }}>
        {/* Header */}
        <Card sx={{ mb: 3, borderRadius: '12px' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Button
                startIcon={<BackIcon />}
                onClick={() => navigate('/voc')}
                variant="outlined"
                sx={{ borderRadius: '8px' }}
              >
                Back to VOC Projects
              </Button>
              <Chip
                label={voc.status?.toUpperCase()}
                color={getStatusColor(voc.status)}
                sx={{ fontWeight: 600 }}
              />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {voc.projectName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {voc.description || 'No description available'}
            </Typography>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {/* Project Progress */}
            <Card sx={{ borderRadius: '12px', mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
                  <ProjectIcon sx={{ mr: 1 }} />
                  Project Progress
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Current Progress
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {getProgressPercentage(voc.status)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={getProgressPercentage(voc.status)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: `${theme.palette.primary.main}15`,
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      }
                    }}
                  />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Start Date
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatDate(voc.vocStartDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        End Date
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatDate(voc.vocEndDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ScheduleIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Duration
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {getDuration()}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Media List */}
            {voc.mediaList?.length > 0 && (
              <Card sx={{ borderRadius: '12px', mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
                    <MediaIcon sx={{ mr: 1 }} />
                    Media Assets
                  </Typography>
                  <List sx={{ p: 0 }}>
                    {voc.mediaList.map((media, index) => (
                      <ListItem key={index} sx={{ px: 0, py: 1 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                            {getMediaIcon(media.mediaType)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={media.mediaDescription || `${media.mediaType} Asset`}
                          secondary={media.mediaType?.toUpperCase()}
                        />
                        {media.mediaURL && (
                          <IconButton
                            component={Link}
                            href={media.mediaURL}
                            target="_blank"
                            size="small"
                          >
                            <OpenIcon />
                          </IconButton>
                        )}
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            )}

            {/* Feedbacks */}
            {feedbacks.length > 0 && (
              <Card sx={{ borderRadius: '12px', mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
                    <FeedbackIcon sx={{ mr: 1 }} />
                    Customer Feedback
                    <Badge badgeContent={feedbacks.length} color="primary" sx={{ ml: 1 }} />
                  </Typography>
                  <List sx={{ p: 0 }}>
                    {feedbacks.filter(feedback => feedback).map((feedback, index) => (
                      <ListItem key={index} sx={{ px: 0, py: 2, borderBottom: index < feedbacks.length - 1 ? `1px solid ${theme.palette.divider}` : 'none' }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                            <StarIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`Rating: ${feedback?.rating || 'N/A'}/5`}
                          secondary={
                            <Box>
                              {feedback?.description && (
                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                  {feedback.description}
                                </Typography>
                              )}
                              <Typography variant="caption" color="text.secondary">
                                Medium: {feedback?.medium || 'N/A'} • {formatDate(feedback?.createdAt)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Customer Information */}
            {customerDetails && (
              <Card sx={{ borderRadius: '12px', mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
                    <BusinessIcon sx={{ mr: 1 }} />
                    Customer Details
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Company
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {customerDetails.companyName}
                      </Typography>
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <PersonIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          Contact Person
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {customerDetails.contactPersonName}
                      </Typography>
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <PhoneIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          Contact Number
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {customerDetails.contactNo}
                      </Typography>
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>  
                        <EmailIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          Email
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {customerDetails.email}
                      </Typography>
                    </Box>
                    {customerDetails.location && (
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Location
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {[customerDetails.location.city, customerDetails.location.state, customerDetails.location.country].filter(Boolean).join(', ')}
                        </Typography>
                        {customerDetails.location.pincode && (
                          <Typography variant="body2" color="text.secondary">
                            PIN: {customerDetails.location.pincode}
                          </Typography>
                        )}
                      </Box>
                    )}
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Business Type
                      </Typography>
                      <Chip
                        label={customerDetails.businessType}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Account Status
                      </Typography>
                      <Chip
                        label={customerDetails.accountStatus?.toUpperCase()}
                        color={customerDetails.accountStatus === 'active' ? 'success' : 'error'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Customer Proficiency
                      </Typography>
                      <Chip
                        label={customerDetails.customerProficiency?.toUpperCase()}
                        size="small"
                        color={customerDetails.customerProficiency === 'advanced' ? 'success' : customerDetails.customerProficiency === 'intermediate' ? 'warning' : 'default'}
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            )}

            {/* VOC Status */}
            <Card sx={{ borderRadius: '12px', mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  VOC Status
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Customer Process Status
                    </Typography>
                    <Chip
                      label={voc.customerDetailsObj?.status?.toUpperCase()}
                      color={getCustomerStatusColor(voc.customerDetailsObj?.status)}
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                  {voc.customerDetailsObj?.customerRequestID?.length > 0 && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Customer Requests
                      </Typography>
                      <Chip
                        icon={<RequestIcon />}
                        label={`${voc.customerDetailsObj.customerRequestID.length} Requests`}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* Product Information */}
            {product && (
              <Card sx={{ borderRadius: '12px' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
                    <ProductIcon sx={{ mr: 1 }} />
                    Product Details
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Product Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {product.productName}
                      </Typography>
                    </Box>
                    {product.description && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Description
                        </Typography>
                        <Typography variant="body2">
                          {product.description}
                        </Typography>
                      </Box>
                    )}
                    {product.version && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Version
                        </Typography>
                        <Chip
                          label={product.version}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>
    </Layout>
  )
}

export default VocDetailPage