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

const VocCard = memo(({ voc }) => {
  const theme = useTheme()

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success'
      case 'ongoing': return 'warning'
      case 'upcoming': return 'info'
      case 'cancelled': return 'error'
      default: return 'default'
    }
  }

  const getStatusGradient = (status) => {
    const gradients = {
      completed: `linear-gradient(135deg, ${theme.palette.success.main}15, ${theme.palette.info.main}08)`,
      ongoing: `linear-gradient(135deg, ${theme.palette.warning.main}15, ${theme.palette.error.main}08)`,
      upcoming: `linear-gradient(135deg, ${theme.palette.info.main}15, ${theme.palette.primary.main}08)`,
      cancelled: `linear-gradient(135deg, ${theme.palette.error.main}15, ${theme.palette.grey[300]}08)`
    }
    return gradients[status?.toLowerCase()] || gradients.upcoming
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
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getDuration = () => {
    if (!voc.vocStartDate || !voc.vocEndDate) return '-'
    const start = new Date(voc.vocStartDate)
    const end = new Date(voc.vocEndDate)
    const diffMs = end - start
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    return `${diffDays}d`
  }

  return (
    <Card 
      sx={{ 
        height: 'auto',
        minHeight: '180px',
        display: 'flex', 
        flexDirection: 'column',
        background: getStatusGradient(voc.status),
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
        {/* Header with Project Name */}
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
              color: theme.palette.text.primary,
              mb: 0.5
            }}
          >
            {voc.projectName}
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
          {voc.description || 'No description available'}
        </Typography>

        {/* Progress Bar */}
        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem', color: 'text.secondary' }}>
              Progress
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.7rem', color: 'primary.main' }}>
              {getProgressPercentage(voc.status)}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={getProgressPercentage(voc.status)}
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

        {/* Status Chips */}
        <Stack direction="row" spacing={0.5} sx={{ mb: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
          <Chip 
            label={voc.status?.toUpperCase()} 
            color={getStatusColor(voc.status)}
            size="small"
            sx={{ 
              fontWeight: 600,
              fontSize: '0.7rem',
              height: '20px',
            }}
          />
          {voc.customerDetailsObj?.status && (
            <Chip 
              label={voc.customerDetailsObj.status?.toUpperCase()} 
              color={voc.customerDetailsObj.status === 'active' ? 'success' : 'error'}
              size="small"
              variant="outlined"
              sx={{ 
                fontWeight: 600,
                fontSize: '0.7rem',
                height: '20px',
              }}
            />
          )}
        </Stack>

        {/* Customer Details */}
        {voc.customerDetailsObj && (
          <Box sx={{ mb: 1.5 }}>
            <Stack spacing={0.5}>
              {voc.customerDetailsObj.companyName && (
                <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  {voc.customerDetailsObj.companyName}
                </Typography>
              )}
              {voc.customerDetailsObj.contactPersonName && (
                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                  {voc.customerDetailsObj.contactPersonName}
                </Typography>
              )}
            </Stack>
          </Box>
        )}

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
                {getDuration()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TimeIcon sx={{ fontSize: 11, color: theme.palette.text.secondary }} />
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontSize: '0.7rem', fontWeight: 500 }}
                >
                  {formatDate(voc.vocStartDate)} - {formatDate(voc.vocEndDate)}
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
          background: voc.status?.toLowerCase() === 'completed' 
            ? theme.palette.success.main 
            : voc.status?.toLowerCase() === 'ongoing'
              ? theme.palette.warning.main
              : voc.status?.toLowerCase() === 'upcoming'
                ? theme.palette.info.main
                : theme.palette.grey[400],
          boxShadow: `0 0 6px ${voc.status?.toLowerCase() === 'completed' 
            ? theme.palette.success.main 
            : voc.status?.toLowerCase() === 'ongoing'
              ? theme.palette.warning.main
              : voc.status?.toLowerCase() === 'upcoming'
                ? theme.palette.info.main
                : theme.palette.grey[400]}40`,
        }}
      />
    </Card>
  )
})

VocCard.displayName = 'VocCard'

export default VocCard