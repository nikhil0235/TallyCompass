import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  IconButton, 
  Rating,
  LinearProgress,
  Stack,
  Tooltip,
  useTheme
} from '@mui/material'
import { useNavigate } from 'react-router-dom';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Star as StarIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material'

const FeedbackCard = ({ feedback }) => {
  const theme = useTheme()
  const navigate = useNavigate();

  const getRatingGradient = (rating) => {
    if (rating >= 4) return `linear-gradient(135deg, ${theme.palette.success.main}15, ${theme.palette.info.main}08)`
    if (rating >= 3) return `linear-gradient(135deg, ${theme.palette.warning.main}15, ${theme.palette.info.main}08)`
    return `linear-gradient(135deg, ${theme.palette.error.main}15, ${theme.palette.warning.main}08)`
  }

  const timeAgo = (date) => {
    const now = new Date()
    const createdDate = new Date(date)
    const diffMs = now - createdDate
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 30) return `${diffDays}d ago`
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card
      sx={{
        height: 'auto',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        background: getRatingGradient(feedback.rating),
        border: `2px solid ${theme.palette.divider}`,
        borderRadius: '8px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: `0 8px 20px ${theme.palette.primary.main}20`,
          transform: 'translateY(-4px)',
          border: `2px solid ${theme.palette.primary.main}40`,
        },
      }}
      onClick={() => navigate(`/feedback/${feedback._id}`)}
    >
      <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header with Customer and Rating */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, gap: 1 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              component="h3"
              sx={{
                fontWeight: 600,
                lineHeight: 1.2,
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                fontSize: '0.95rem',
                color: theme.palette.text.primary,
                mb: 0.5
              }}
            >
              {feedback.customerId?.name || feedback.customerId?.companyName || 'Anonymous Customer'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Rating value={feedback.rating || 0} readOnly size="small" />
              <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                {feedback.rating || 0}/5
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.4em',
            lineHeight: 1.3,
            fontSize: '0.85rem'
          }}
        >
          "{feedback.description || 'No description provided'}"
        </Typography>

        {/* Rating Progress Bar */}
        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem', color: 'text.secondary' }}>
              Satisfaction
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.7rem', color: 'primary.main' }}>
              {((feedback.rating || 0) / 5 * 100).toFixed(0)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(feedback.rating || 0) / 5 * 100}
            sx={{
              height: '4px',
              borderRadius: '2px',
              backgroundColor: `${theme.palette.primary.main}15`,
              '& .MuiLinearProgress-bar': {
                borderRadius: '2px',
                background: feedback.rating >= 4 
                  ? `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.info.main})`
                  : feedback.rating >= 3
                    ? `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.secondary.main})`
                    : `linear-gradient(90deg, ${theme.palette.error.main}, ${theme.palette.warning.main})`,
              }
            }}
          />
        </Box>

        {/* Chips Section */}
        <Stack direction="row" spacing={0.5} sx={{ mb: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
          <Chip
            label={feedback.medium || 'Unknown'}
            size="small"
            variant="outlined"
            sx={{
              fontWeight: 600,
              fontSize: '0.7rem',
              height: '24px',
            }}
          />
          <Chip
            label={`${feedback.rating || 0}/5`}
            size="small"
            color={feedback.rating >= 4 ? 'success' : feedback.rating >= 3 ? 'warning' : 'error'}
            sx={{
              fontWeight: 600,
              fontSize: '0.7rem',
              height: '24px',
            }}
          />
        </Stack>

        {/* Footer */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
          <Box sx={{ width: '100%', borderTop: `1px solid ${theme.palette.divider}`, pt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                Customer Feedback
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarIcon sx={{ fontSize: 11, color: theme.palette.text.secondary }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                  {timeAgo(feedback.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>

      {/* Rating Status Badge Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: feedback.rating >= 4 ? theme.palette.success.main : feedback.rating >= 3 ? theme.palette.warning.main : theme.palette.error.main,
          boxShadow: `0 0 6px ${feedback.rating >= 4 ? theme.palette.success.main : feedback.rating >= 3 ? theme.palette.warning.main : theme.palette.error.main}40`,
        }}
      />
    </Card>
  )
}

export default FeedbackCard