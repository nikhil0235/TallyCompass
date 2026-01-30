import { memo } from 'react'
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  Stack,
  useTheme,
  LinearProgress
} from '@mui/material'
import { 
  AccessTime as TimeIcon
} from '@mui/icons-material'

const RequestCard = memo(({ 
  request, 
  statusColor = 'default',
  priorityColor = 'default'
}) => {
  const theme = useTheme()

  const getStatusGradient = (status) => {
    const gradients = {
      open: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.info.main}08)`,
      'in-progress': `linear-gradient(135deg, ${theme.palette.warning.main}15, ${theme.palette.error.main}08)`,
      resolved: `linear-gradient(135deg, ${theme.palette.success.main}15, ${theme.palette.info.main}08)`,
      closed: `linear-gradient(135deg, ${theme.palette.grey[400]}15, ${theme.palette.grey[300]}08)`
    }
    return gradients[status] || gradients.open
  }

  const getProgressPercentage = (status) => {
    const progress = {
      open: 0,
      'in-progress': 50,
      resolved: 100,
      closed: 100
    }
    return progress[status] || 0
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
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card 
      sx={{ 
        height: 'auto',
        minHeight: '180px',
        display: 'flex', 
        flexDirection: 'column',
        background: getStatusGradient(request.status),
        border: `2px solid ${theme.palette.divider}`,
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': { 
          boxShadow: `0 8px 20px ${theme.palette.primary.main}20`,
          transform: 'translateY(-4px)',
          border: `2px solid ${theme.palette.primary.main}40`,
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header with Title */}
        <Box sx={{ mb: 1.5 }}>
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
              color: theme.palette.text.primary
            }}
          >
            {request.title}
          </Typography>
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
            fontSize: '0.8rem'
          }}
        >
          {request.description}
        </Typography>

        {/* Progress Bar */}
        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem', color: 'text.secondary' }}>
              Progress
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.7rem', color: 'primary.main' }}>
              {getProgressPercentage(request.status)}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={getProgressPercentage(request.status)}
            sx={{
              height: '4px',
              borderRadius: '2px',
              backgroundColor: `${theme.palette.primary.main}15`,
              '& .MuiLinearProgress-bar': {
                borderRadius: '2px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }
            }}
          />
        </Box>

        {/* Chips Section */}
        <Stack direction="row" spacing={0.5} sx={{ mb: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
          <Chip 
            label={request.status?.replace('-', ' ').toUpperCase()} 
            color={statusColor}
            size="small"
            sx={{ 
              fontWeight: 600,
              fontSize: '0.7rem',
              height: '20px',
            }}
          />
          <Chip 
            label={request.priority?.toUpperCase()} 
            color={priorityColor}
            size="small"
            variant="outlined"
            sx={{ 
              fontWeight: 600,
              fontSize: '0.7rem',
              height: '20px',
            }}
          />
          <Chip 
            label={request.type?.toUpperCase()}
            size="small"
            variant="outlined"
            sx={{ 
              fontWeight: 600,
              fontSize: '0.7rem',
              height: '20px',
            }}
          />
        </Stack>

        {/* Footer */}
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          alignItems: 'flex-end'
        }}>
          <Box sx={{ width: '100%', borderTop: `1px solid ${theme.palette.divider}`, pt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ fontWeight: 600, fontSize: '0.7rem' }}
              >
                {Array.isArray(request.customerList) ? `${request.customerList.length} customer(s)` : request.customerName}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TimeIcon sx={{ fontSize: 11, color: theme.palette.text.secondary }} />
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontSize: '0.7rem', fontWeight: 500 }}
                >
                  {timeAgo(request.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>

      {/* Status Badge Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: request.status === 'resolved' 
            ? theme.palette.success.main 
            : request.status === 'in-progress'
              ? theme.palette.warning.main
              : request.status === 'open'
                ? theme.palette.primary.main
                : theme.palette.grey[400],
          boxShadow: `0 0 6px ${request.status === 'resolved' 
            ? theme.palette.success.main 
            : request.status === 'in-progress'
              ? theme.palette.warning.main
              : request.status === 'open'
                ? theme.palette.primary.main
                : theme.palette.grey[400]}40`,
        }}
      />
    </Card>
  )
})

RequestCard.displayName = 'RequestCard'

export default RequestCard