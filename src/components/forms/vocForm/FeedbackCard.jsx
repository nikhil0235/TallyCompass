import { Card, CardContent, Box, Typography, Checkbox, Chip } from '@mui/material'
import { CheckCircle as CheckIcon, Star as StarIcon } from '@mui/icons-material'

const FeedbackCard = ({ feedback, isSelected, onToggle, theme }) => (
  <Card
    onClick={() => onToggle(feedback._id)}
    sx={{
      border: isSelected ? `2.5px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      background: isSelected ? `${theme.palette.primary.main}08` : theme.palette.background.paper,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.info.main})`,
        opacity: 0,
        transition: 'opacity 0.3s ease',
      },
      '&:hover': {
        boxShadow: `0 8px 24px ${theme.palette.primary.main}25`,
        transform: 'translateY(-4px)',
        '&::before': {
          opacity: 1,
        }
      }
    }}
  >
    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Checkbox
          checked={isSelected}
          onChange={() => onToggle(feedback._id)}
          sx={{ mt: -0.5, flexShrink: 0 }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box sx={{ display: 'flex', gap: 0.25 }}>
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  sx={{
                    fontSize: 14,
                    color: i < (feedback.rating || 0) ? theme.palette.warning.main : theme.palette.divider
                  }}
                />
              ))}
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
              {feedback.rating || 0}/5
            </Typography>
          </Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
            {feedback.feedbackText?.substring(0, 50) || feedback.description?.substring(0, 50) || 'Customer Feedback'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontSize: '0.85rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {feedback.description?.substring(0, 80) || feedback.feedbackText?.substring(0, 80) || 'No description'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            <Chip
              label={feedback.feedbackType || feedback.medium || 'General'}
              size="small"
              variant="outlined"
              sx={{
                height: '24px',
                fontSize: '0.7rem',
                fontWeight: 600,
                borderColor: feedback.medium === 'Email' ? theme.palette.info.main : theme.palette.success.main,
                color: feedback.medium === 'Email' ? theme.palette.info.main : theme.palette.success.main,
              }}
            />
          </Box>
        </Box>
        {isSelected && (
          <CheckIcon sx={{ color: theme.palette.primary.main, fontSize: 20, flexShrink: 0 }} />
        )}
      </Box>
    </CardContent>
  </Card>
)

export default FeedbackCard