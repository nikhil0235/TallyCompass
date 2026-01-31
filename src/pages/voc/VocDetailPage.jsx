import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
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
  Badge,
  Link,
  Paper,
  Stack,
  Rating,
  Tabs,
  Tab,
  Tooltip,
  Fade
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
  OpenInNew as OpenIcon,
  TrendingUp as TrendingIcon,
  TrendingDown as ReductionIcon,
  Assessment as MetricsIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  VerifiedUser as VerifiedIcon
} from '@mui/icons-material'
import Layout from '../../components/common/Layout'

const VocDetailPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const voc = location.state?.voc
  const [activeTab, setActiveTab] = useState(0)
  const [metrics, setMetrics] = useState({
    avgRating: 0,
    resolvedRequests: 0,
    totalRequests: 0,
    mediaCount: 0
  })

  useEffect(() => {
    if (voc) {
      const feedbackList = voc.feedbackList || []
      const requestList = voc.customerDetailsObj?.customerRequestID || []
      const mediaList = voc.mediaList || []

      const avgRating = feedbackList.length
        ? (feedbackList.reduce((sum, fb) => sum + (fb.rating || 0), 0) / feedbackList.length).toFixed(1)
        : 0

      const resolved = requestList.filter(r => r?.status?.toLowerCase() === 'completed').length

      setMetrics({
        avgRating,
        resolvedRequests: resolved,
        totalRequests: requestList.length,
        mediaCount: mediaList.length
      })
    }
  }, [voc])

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success'
      case 'ongoing':
        return 'warning'
      case 'upcoming':
        return 'info'
      case 'cancelled':
        return 'error'
      default:
        return 'default'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      case 'low':
        return 'success'
      default:
        return 'default'
    }
  }

  const getRequestStatusIcon = (status) => {
    const iconProps = { sx: { fontSize: '20px' } }
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckIcon color="success" {...iconProps} />
      case 'in-progress':
        return <WarningIcon color="warning" {...iconProps} />
      case 'pending':
        return <InfoIcon color="info" {...iconProps} />
      default:
        return <ErrorIcon color="error" {...iconProps} />
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
      month: 'short',
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
      case 'image':
        return <MediaIcon />
      case 'video':
        return <VideoIcon />
      case 'document':
        return <DocumentIcon />
      default:
        return <MediaIcon />
    }
  }

  const resolutionRate = metrics.totalRequests > 0
    ? Math.round((metrics.resolvedRequests / metrics.totalRequests) * 100)
    : 0

  if (!voc) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Card
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: '14px',
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography variant="h6" color="error" sx={{ mb: 2, fontWeight: 700 }}>
              VOC Project Not Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              The project you're looking for doesn't exist or has been removed.
            </Typography>
            <Button
              variant="contained"
              startIcon={<BackIcon />}
              onClick={() => navigate('/voc')}
            >
              Back to VOC Projects
            </Button>
          </Card>
        </Box>
      </Layout>
    )
  }

  return (
    <Layout>
      <Box sx={{ pb: 4 }}>
        {/* Header with Gradient */}
        <Fade in={true} timeout={400}>
          <Card
            sx={{
              mb: 3,
              borderRadius: '14px',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}12 0%, ${theme.palette.secondary.main}08 100%)`,
              border: `1px solid ${theme.palette.divider}`,
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                boxShadow: `0 8px 32px ${theme.palette.primary.main}15`
              }
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
                <Button
                  startIcon={<BackIcon />}
                  onClick={() => navigate('/voc')}
                  variant="outlined"
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    border: `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                      borderColor: theme.palette.primary.main
                    }
                  }}
                >
                  Back
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                  <Chip 
                    label={`${metrics.avgRating}/5 ★`} 
                    size="small" 
                    sx={{ bgcolor: 'success.main', color: 'white', fontWeight: 600, minWidth: '60px' }} 
                  />
                  <Chip 
                    label={`${resolutionRate}% done`} 
                    size="small" 
                    sx={{ bgcolor: 'info.main', color: 'white', fontWeight: 600, minWidth: '70px' }} 
                  />
                  <Chip 
                    label={`${metrics.totalRequests} req`} 
                    size="small" 
                    sx={{ bgcolor: 'warning.main', color: 'white', fontWeight: 600, minWidth: '50px' }} 
                  />
                  <Chip 
                    label={`${metrics.mediaCount} files`} 
                    size="small" 
                    sx={{ bgcolor: 'secondary.main', color: 'white', fontWeight: 600, minWidth: '60px' }} 
                  />
                  <Chip
                    label={voc.status?.toUpperCase()}
                    color={getStatusColor(voc.status)}
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      letterSpacing: '0.5px',
                      minWidth: '80px'
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                    letterSpacing: '-0.5px'
                  }}
                >
                  {voc.projectName}
                </Typography>
              </Box>

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
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  lineHeight: 1.6,
                  maxWidth: '700px',
                  mb: 1.5
                }}
              >
                {voc.description || 'No description available'}
              </Typography>
              
              <Typography variant="caption" color="text.secondary">
                Last updated: {formatDate(voc.updatedAt)}
              </Typography>
            </CardContent>
          </Card>
        </Fade>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box sx={{ flex: '1 1 70%' }}>
            {/* Tabbed Content */}
            <Card sx={{ borderRadius: '12px', height: '100%' }}>
              <Box sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Tabs
                  value={activeTab}
                  onChange={(e, val) => setActiveTab(val)}
                  sx={{
                    px: 3,
                    '& .MuiTab-root': {
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover
                      }
                    },
                    '& .MuiTabs-indicator': {
                      height: 3,
                      borderRadius: '2px'
                    }
                  }}
                >
                  <Tab label="Project" icon={<ScheduleIcon />} iconPosition="start" />
                  <Tab label="Requests" icon={<RequestIcon />} iconPosition="start" />
                  <Tab label="Feedback" icon={<FeedbackIcon />} iconPosition="start" />
                  <Tab label="Media" icon={<MediaIcon />} iconPosition="start" />
                </Tabs>
              </Box>

              <CardContent sx={{ p: 2, height: 'calc(100vh - 280px)', overflow: 'hidden' }}>
                {/* Timeline Tab */}
                {activeTab === 0 && (
                  <Box>
                    {/* Stats above progress */}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <StatCard 
                        label="Total Requests"
                        value={metrics.totalRequests}
                        icon={<RequestIcon />}
                        color="primary"
                      />
                      <StatCard 
                        label="Resolved"
                        value={metrics.resolvedRequests}
                        icon={<CheckIcon />}
                        color="success"
                      />
                      <StatCard 
                        label="Avg Rating"
                        value={metrics.avgRating}
                        icon={<StarIcon />}
                        color="warning"
                      />
                      <StatCard 
                        label="Media Files"
                        value={metrics.mediaCount}
                        icon={<MediaIcon />}
                        color="secondary"
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                          Project Progress
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 800, color: theme.palette.primary.main }}
                          >
                            {getProgressPercentage(voc.status)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            %
                          </Typography>
                        </Box>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getProgressPercentage(voc.status)}
                        sx={{
                          height: 8,
                          borderRadius: 6,
                          backgroundColor: `${theme.palette.primary.main}12`,
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 6,
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                          }
                        }}
                      />
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9rem', mb: 1 }}>
                      Project Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.4, fontSize: '0.85rem' }}>
                      {voc.description || 'No description available'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <TimelineItem
                        icon={<CalendarIcon />}
                        label="Start Date"
                        value={formatDate(voc.vocStartDate)}
                      />
                      <TimelineItem
                        icon={<CalendarIcon />}
                        label="End Date"
                        value={formatDate(voc.vocEndDate)}
                      />
                      <TimelineItem
                        icon={<ScheduleIcon />}
                        label="Duration"
                        value={getDuration()}
                      />
                    </Box>
                  </Box>
                )}

                {/* Requests Tab */}
                {activeTab === 1 && (
                  <Box>
                    {metrics.totalRequests > 0 ? (
                      <List sx={{ p: 0 }}>
                        {(voc.customerDetailsObj?.customerRequestID || [])
                          .filter(req => req)
                          .map((request, index) => (
                            <ListItem
                              key={index}
                              sx={{
                                px: 2,
                                py: 2.5,
                                borderRadius: '10px',
                                mb: 1.5,
                                backgroundColor: theme.palette.action.hover,
                                border: `1px solid ${theme.palette.divider}`,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  backgroundColor: theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.08)' 
                                    : 'rgba(0, 0, 0, 0.04)',
                                  borderColor: theme.palette.primary.main,
                                  boxShadow: `0 4px 12px ${theme.palette.primary.main}15`
                                }
                              }}
                            >
                              <ListItemAvatar>
                                <Avatar
                                  sx={{
                                    bgcolor:
                                      request?.status === 'completed'
                                        ? theme.palette.success.main
                                        : request?.status === 'in-progress'
                                        ? theme.palette.warning.main
                                        : theme.palette.info.main,
                                    width: 44,
                                    height: 44
                                  }}
                                >
                                  {getRequestStatusIcon(request?.status)}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                                    {request?.title || request?.requestTitle || `Request #${index + 1}`}
                                  </Typography>
                                }
                                secondary={
                                  <Box sx={{ mt: 1 }}>
                                    {request?.description && (
                                      <Typography
                                        variant="body2"
                                        sx={{ mb: 1.5, lineHeight: 1.6 }}
                                        color="text.secondary"
                                      >
                                        {request.description}
                                      </Typography>
                                    )}
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                      <Chip
                                        label={request?.type || 'General'}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontWeight: 600 }}
                                      />
                                      <Chip
                                        label={`Priority: ${request?.priority || 'Medium'}`.toUpperCase()}
                                        size="small"
                                        color={getPriorityColor(request?.priority)}
                                        sx={{ fontWeight: 600 }}
                                      />
                                      <Chip
                                        label={`${request?.status || 'Pending'}`.toUpperCase()}
                                        size="small"
                                        color={
                                          request?.status === 'completed'
                                            ? 'success'
                                            : request?.status === 'in-progress'
                                            ? 'warning'
                                            : 'default'
                                        }
                                        sx={{ fontWeight: 600 }}
                                      />
                                    </Box>
                                  </Box>
                                }
                              />
                            </ListItem>
                          ))}
                      </List>
                    ) : (
                      <EmptyState
                        icon={<RequestIcon />}
                        title="No Requests"
                        description="There are no customer requests for this project yet."
                      />
                    )}
                  </Box>
                )}

                {/* Feedback Tab */}
                {activeTab === 2 && (
                  <Box>
                    {(voc.feedbackList || []).length > 0 ? (
                      <List sx={{ p: 0 }}>
                        {voc.feedbackList.map((feedback, index) => (
                          <ListItem
                            key={index}
                            sx={{
                              px: 2,
                              py: 2.5,
                              borderRadius: '10px',
                              mb: 1.5,
                              backgroundColor: theme.palette.action.hover,
                              border: `1px solid ${theme.palette.divider}`,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' 
                                  ? 'rgba(255, 255, 255, 0.08)' 
                                  : 'rgba(0, 0, 0, 0.04)',
                                borderColor: theme.palette.primary.main,
                                boxShadow: `0 4px 12px ${theme.palette.primary.main}15`
                              }
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar
                                sx={{
                                  bgcolor:
                                    (feedback?.rating || 0) >= 4
                                      ? theme.palette.success.main
                                      : (feedback?.rating || 0) >= 3
                                      ? theme.palette.warning.main
                                      : theme.palette.error.main,
                                  width: 44,
                                  height: 44
                                }}
                              >
                                <StarIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                                  <Rating value={feedback?.rating || 0} readOnly size="small" />
                                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                    {feedback?.rating || 'N/A'}/5
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <Box sx={{ mt: 0.5 }}>
                                  {feedback?.feedbackText || feedback?.description ? (
                                    <Typography
                                      variant="body2"
                                      sx={{ mb: 1.5, lineHeight: 1.6 }}
                                    >
                                      "{feedback?.feedbackText || feedback?.description}"
                                    </Typography>
                                  ) : null}
                                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Chip
                                      label={feedback?.feedbackType || feedback?.medium || 'Direct'}
                                      size="small"
                                      variant="outlined"
                                      sx={{ fontWeight: 600 }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                      {formatDate(feedback?.createdAt)}
                                    </Typography>
                                  </Box>
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <EmptyState
                        icon={<FeedbackIcon />}
                        title="No Feedback"
                        description="No customer feedback has been collected yet."
                      />
                    )}
                  </Box>
                )}

                {/* Media Tab */}
                {activeTab === 3 && (
                  <Box>
                    {metrics.mediaCount > 0 ? (
                      <Grid container spacing={2}>
                        {(voc.mediaList || []).map((media, index) => (
                          <Grid item xs={12} sm={6} key={index}>
                            <Paper
                              sx={{
                                p: 2.5,
                                borderRadius: '10px',
                                border: `1px solid ${theme.palette.divider}`,
                                transition: 'all 0.2s ease',
                                backgroundColor: theme.palette.action.hover,
                                '&:hover': {
                                  borderColor: theme.palette.primary.main,
                                  boxShadow: `0 6px 16px ${theme.palette.primary.main}20`,
                                  transform: 'translateY(-2px)'
                                }
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                <Avatar
                                  sx={{
                                    bgcolor: theme.palette.secondary.main,
                                    width: 44,
                                    height: 44,
                                    fontSize: '18px'
                                  }}
                                >
                                  {getMediaIcon(media?.mediaType)}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                                    {media?.mediaDescription || `${media?.mediaType} Asset`}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {media?.mediaType?.toUpperCase()}
                                  </Typography>
                                </Box>
                                {media?.mediaURL && (
                                  <Tooltip title="Open media">
                                    <IconButton
                                      component={Link}
                                      href={media.mediaURL}
                                      target="_blank"
                                      size="small"
                                      sx={{
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                          transform: 'scale(1.2)'
                                        }
                                      }}
                                    >
                                      <OpenIcon sx={{ fontSize: '18px' }} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Box>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <EmptyState
                        icon={<MediaIcon />}
                        title="No Media"
                        description="No media assets have been uploaded for this project."
                      />
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 30%' }}>
            {/* Company Info Card - Enhanced */}
            {voc.customerDetailsObj && (
              <Card
                sx={{
                  borderRadius: '12px',
                  border: `2px solid ${theme.palette.primary.main}30`,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}12 0%, ${theme.palette.secondary.main}08 100%)`,
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    boxShadow: `0 12px 36px ${theme.palette.primary.main}20`,
                    borderColor: theme.palette.primary.main,
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Company Header */}
                  <Box sx={{ 
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}10)`,
                    borderRadius: '10px',
                    p: 2.5,
                    mb: 2.5,
                    textAlign: 'center',
                    border: `1px solid ${theme.palette.primary.main}20`
                  }}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        mx: 'auto',
                        mb: 1.5,
                        bgcolor: theme.palette.primary.main,
                        fontSize: '1.3rem',
                        fontWeight: 700,
                        boxShadow: `0 4px 12px ${theme.palette.primary.main}40`
                      }}
                    >
                      {voc.customerDetailsObj?.companyName?.charAt(0)?.toUpperCase() || 'C'}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, fontSize: '1rem' }}>
                      {voc.customerDetailsObj?.companyName || 'Company Name'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', display: 'block' }}>
                      {voc.customerDetailsObj?.businessType || 'Business type not specified'}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Contact Person */}
                  <Box sx={{ mb: 2.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.7rem' }}>
                      <PersonIcon sx={{ fontSize: '14px', mr: 0.5, verticalAlign: 'middle' }} />
                      Contact Person
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 0.5 }}>
                      {voc.customerDetailsObj?.contactPersonName || 'Not specified'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PhoneIcon sx={{ fontSize: '12px' }} />
                      {voc.customerDetailsObj?.contactNo || 'No contact'}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Account Details */}
                  <Box sx={{ mb: 2.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.7rem' }}>
                      <BusinessIcon sx={{ fontSize: '14px', mr: 0.5, verticalAlign: 'middle' }} />
                      Account
                    </Typography>
                    <Stack spacing={1.2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.3 }}>
                          Plan Type
                        </Typography>
                        <Chip
                          label={voc.customerDetailsObj?.planType || 'Standard'}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontWeight: 600, fontSize: '0.75rem', width: '100%' }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.3 }}>
                          Account Status
                        </Typography>
                        <Chip
                          label={voc.customerDetailsObj?.accountStatus?.toUpperCase() || 'ACTIVE'}
                          size="small"
                          color={getStatusColor(voc.customerDetailsObj?.accountStatus)}
                          sx={{ fontWeight: 600, fontSize: '0.75rem', width: '100%' }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.3 }}>
                          User Level
                        </Typography>
                        <Chip
                          label={`${voc.customerDetailsObj?.customerProficiency?.toUpperCase() || 'BEGINNER'} USER`}
                          size="small"
                          color="info"
                          variant="outlined"
                          sx={{ fontWeight: 600, fontSize: '0.75rem', width: '100%' }}
                        />
                      </Box>
                    </Stack>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Quick Stats */}
                  <Box sx={{ mb: 0 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.7rem' }}>
                      <MetricsIcon sx={{ fontSize: '14px', mr: 0.5, verticalAlign: 'middle' }} />
                      Quick Stats
                    </Typography>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, backgroundColor: theme.palette.action.hover, borderRadius: '8px' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                          Requests
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
                          {metrics.totalRequests}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, backgroundColor: theme.palette.action.hover, borderRadius: '8px' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                          Resolved
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: theme.palette.success.main }}>
                          {metrics.resolvedRequests}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, backgroundColor: theme.palette.action.hover, borderRadius: '8px' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                          Avg Rating
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: theme.palette.warning.main }}>
                          {metrics.avgRating}★
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>
      </Box>
    </Layout>
  )
}

// Helper Components
const StatCard = ({ icon, label, value, color = 'primary' }) => {
  const theme = useTheme()

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        borderRadius: '8px',
        backgroundColor: theme.palette[color].main + '08',
        border: `1px solid ${theme.palette[color].main}20`,
        textAlign: 'center',
        flex: '1 1 120px',
        minWidth: '100px'
      }}
    >
      <Box
        sx={{
          p: 0.5,
          backgroundColor: theme.palette[color].main + '15',
          borderRadius: '6px',
          color: theme.palette[color].main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          mb: 0.5
        }}
      >
        {icon}
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600, mb: 0.5, fontSize: '0.7rem' }}>
        {label}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.2rem', color: theme.palette[color].main }}>
        {value}
      </Typography>
    </Paper>
  )
}

const TimelineItem = ({ icon, label, value }) => {
  const theme = useTheme()

  return (
    <Box sx={{ flex: '1 1 200px', minWidth: '150px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.75 }}>
        {icon && <Box sx={{ fontSize: '16px', mr: 0.75, color: theme.palette.primary.main }}>{icon}</Box>}
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
          {label}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 700, ml: icon ? 2.5 : 0, fontSize: '0.95rem' }}>
        {value}
      </Typography>
    </Box>
  )
}

const MetricRow = ({ label, value, color }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          color: color
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}

const DetailItem = ({ label, value, isMonospace = false }) => {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600, mb: 0.25 }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          ...(isMonospace && { fontFamily: 'monospace', fontSize: '0.85rem' })
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}

const EmptyState = ({ icon, title, description }) => {
  const theme = useTheme()

  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Box sx={{ fontSize: 72, color: theme.palette.text.disabled, mb: 2, display: 'flex', justifyContent: 'center', opacity: 0.5 }}>
        {icon}
      </Box>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  )
}

export default VocDetailPage