import { Box, Typography, Card, CardContent, Chip } from '@mui/material'
import { 
  CheckCircle as CheckIcon, 
  Assignment as ProjectIcon, 
  Feedback as FeedbackIcon, 
  AttachFile as MediaIcon
} from '@mui/icons-material'

const ReviewStep = ({ 
  formData, 
  selectedCustomer, 
  selectedRequestCount, 
  selectedFeedbackCount, 
  uploadedFiles, 
  projectDays,
  customerRequests,
  feedbacks,
  theme 
}) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Upcoming': return theme.palette.info.main
      case 'Ongoing': return theme.palette.warning.main
      case 'Completed': return theme.palette.success.main
      case 'Cancelled': return theme.palette.error.main
      default: return theme.palette.grey[500]
    }
  }

  return (
    <Box sx={{ p: 1.5, borderTop: `2px solid ${theme.palette.divider}` }}>
      <Card sx={{ 
        borderRadius: '12px', 
        boxShadow: `0 4px 16px ${theme.palette.primary.main}08`,
        border: `1px solid ${theme.palette.primary.main}15`,
        background: theme.palette.background.paper,
        overflow: 'hidden'
      }}>


        <CardContent sx={{ p: 2, pt: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CheckIcon sx={{ color: theme.palette.success.main, fontSize: 18 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
              Project Review
            </Typography>
          </Box>

          {/* Stats */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, mb: 2 }}>
            <Box sx={{ textAlign: 'center', p: 1, borderRadius: '6px', backgroundColor: theme.palette.error.main + '10' }}>
              <ProjectIcon sx={{ fontSize: 16, color: theme.palette.error.main, mb: 0.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                {selectedRequestCount}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>Requests</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', p: 1, borderRadius: '6px', backgroundColor: theme.palette.success.main + '10' }}>
              <FeedbackIcon sx={{ fontSize: 16, color: theme.palette.success.main, mb: 0.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                {selectedFeedbackCount}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>Feedback</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', p: 1, borderRadius: '6px', backgroundColor: theme.palette.secondary.main + '10' }}>
              <MediaIcon sx={{ fontSize: 16, color: theme.palette.secondary.main, mb: 0.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                {uploadedFiles.length}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>Files</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', p: 1, borderRadius: '6px', backgroundColor: theme.palette.info.main + '10' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', color: theme.palette.info.main }}>
                {projectDays}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>Days</Typography>
            </Box>
          </Box>

          {/* Project Info */}
          <Box sx={{ display: 'grid', gap: 1.5 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem' }}>
                  PROJECT NAME
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                  {formData.projectName || '—'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem' }}>
                  STATUS
                </Typography>
                <Box sx={{ mt: 0.25 }}>
                  <Chip
                    label={formData.status}
                    size="small"
                    sx={{
                      height: '18px',
                      fontSize: '0.65rem',
                      backgroundColor: getStatusColor(formData.status),
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem' }}>
                  CUSTOMER
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                  {selectedCustomer?.companyName || '—'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem' }}>
                  DATE RANGE
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                  {formData.vocStartDate && formData.vocEndDate
                    ? `${new Date(formData.vocStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(formData.vocEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                    : '—'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Quick Preview */}
          {(selectedRequestCount > 0 || selectedFeedbackCount > 0 || uploadedFiles.length > 0) && (
            <Box sx={{ mt: 2, pt: 1.5, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem', mb: 1, display: 'block' }}>
                Media Attachments
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {formData.customerDetailsObj?.customerRequestID?.slice(0, 2).map((id) => {
                  const req = customerRequests.find(r => r._id === id)
                  return (
                    <Chip
                      key={id}
                      label={`📋 ${(req?.title || req?.requestTitle || 'Customer Request').substring(0, 20)}...`}
                      size="small"
                      clickable
                      onClick={() => {
                        console.log('Opening request:', req)
                      }}
                      sx={{ 
                        height: '20px', 
                        fontSize: '0.65rem', 
                        backgroundColor: theme.palette.error.main + '15', 
                        color: theme.palette.error.main,
                        '&:hover': {
                          backgroundColor: theme.palette.error.main + '25',
                          transform: 'scale(1.05)'
                        }
                      }}
                    />
                  )
                })}
                {formData.customerDetailsObj?.feedbackID?.slice(0, 2).map((id) => {
                  const fb = feedbacks.find(f => f._id === id)
                  return (
                    <Chip
                      key={id}
                      label={`💬 ${fb?.rating || 0}★ Customer Feedback`}
                      size="small"
                      clickable
                      onClick={() => {
                        console.log('Opening feedback:', fb)
                      }}
                      sx={{ 
                        height: '20px', 
                        fontSize: '0.65rem', 
                        backgroundColor: theme.palette.success.main + '15', 
                        color: theme.palette.success.main,
                        '&:hover': {
                          backgroundColor: theme.palette.success.main + '25',
                          transform: 'scale(1.05)'
                        }
                      }}
                    />
                  )
                })}
                {uploadedFiles.slice(0, 2).map((file) => (
                  <Chip
                    key={file.id}
                    label={`📎 ${file.name.length > 15 ? file.name.substring(0, 15) + '...' : file.name}`}
                    size="small"
                    clickable
                    onClick={() => {
                      if (file.file) {
                        const url = URL.createObjectURL(file.file)
                        window.open(url, '_blank')
                        setTimeout(() => URL.revokeObjectURL(url), 1000)
                      }
                    }}
                    sx={{ 
                      height: '20px', 
                      fontSize: '0.65rem', 
                      backgroundColor: theme.palette.secondary.main + '15', 
                      color: theme.palette.secondary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.secondary.main + '25',
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                ))}
                {(selectedRequestCount + selectedFeedbackCount + uploadedFiles.length) > 6 && (
                  <Chip 
                    label={`+${(selectedRequestCount + selectedFeedbackCount + uploadedFiles.length) - 6} more items`} 
                    size="small" 
                    sx={{ height: '20px', fontSize: '0.65rem' }} 
                  />
                )}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default ReviewStep