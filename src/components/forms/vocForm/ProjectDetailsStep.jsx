import { Box, Card, CardContent, Grid, TextField, MenuItem, Typography, useTheme, Tooltip, Chip, LinearProgress } from '@mui/material'
import { BuildCircle as BuildIcon, CalendarToday as CalendarIcon, InfoOutlined as InfoIcon } from '@mui/icons-material'
import { useState, useMemo } from 'react'

const STATUS_OPTIONS = [
  { value: 'Upcoming', label: 'Upcoming', color: 'info' },
  { value: 'Ongoing', label: 'Ongoing', color: 'warning' },
  { value: 'Completed', label: 'Completed', color: 'success' },
  { value: 'Cancelled', label: 'Cancelled', color: 'error' }
]

const ProjectDetailsStep = ({ formData, handleChange, loading }) => {
  const theme = useTheme()
  const [focusedField, setFocusedField] = useState(null)
  
  const projectDays = formData.vocStartDate && formData.vocEndDate ? 
    Math.ceil((new Date(formData.vocEndDate) - new Date(formData.vocStartDate)) / (1000 * 60 * 60 * 24)) : 0

  const projectWeeks = useMemo(() => Math.ceil(projectDays / 7), [projectDays])
  const projectMonths = useMemo(() => Math.ceil(projectDays / 30), [projectDays])
  
  const completionPercentage = useMemo(() => {
    if (!formData.projectName || !formData.status || !formData.vocStartDate || !formData.vocEndDate || !formData.description) return 0
    return 100
  }, [formData])

  const statusOption = STATUS_OPTIONS.find(opt => opt.value === formData.status)

  const getFieldStyles = (fieldName) => ({
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      fontSize: '0.95rem',
      background: focusedField === fieldName ? 'white' : 'rgba(255,255,255,0.6)',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      border: `1.5px solid ${focusedField === fieldName ? theme.palette.primary.main : theme.palette.grey[300]}`,
      '&:hover': { 
        background: 'white',
        borderColor: theme.palette.primary.light,
        boxShadow: `0 4px 12px ${theme.palette.primary.main}10`
      },
      '&.Mui-focused': { 
        boxShadow: `0 8px 24px ${theme.palette.primary.main}25`,
        background: 'white',
        borderColor: theme.palette.primary.main
      }
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    }
  })

  return (
    <Box sx={{ p: 2, borderTop: `2px solid #ccc` }}>

      <Card sx={{ 
        borderRadius: '20px', 
        boxShadow: `0 12px 48px ${theme.palette.primary.main}08`,
        border: `1px solid ${theme.palette.primary.main}15`,
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.main}01 100%)`,
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: `0 20px 64px ${theme.palette.primary.main}12`,
          borderColor: `${theme.palette.primary.main}25`
        }
      }}>
        {/* Animated Top Border */}


        <CardContent sx={{ p: 4 }}>
          {/* Main Content */}
          <Box>
            {/* Row 1: 4 Fields in One Row */}
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 3,
              mb: 4,
              pb: 4,
              borderBottom: `1px solid ${theme.palette.grey[200]}`
            }}>
              {/* Project Name - 1/4 width */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.875rem' }}>
                    Project Name
                  </Typography>
                  <Tooltip title="Give your VOC initiative a clear, descriptive name">
                    <InfoIcon sx={{ fontSize: 16, color: theme.palette.text.secondary, cursor: 'pointer' }} />
                  </Tooltip>
                </Box>
                <TextField
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('projectName')}
                  onBlur={() => setFocusedField(null)}
                  fullWidth
                  required
                  disabled={loading}
                  placeholder="e.g., Q4 2024 Initiative"
                  variant="outlined"
                  size="small"
                  sx={getFieldStyles('projectName')}
                />
              </Box>

              {/* Status - 1/4 width */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.875rem' }}>
                    Status
                  </Typography>
                  <Tooltip title="Select the current phase of your project">
                    <InfoIcon sx={{ fontSize: 16, color: theme.palette.text.secondary, cursor: 'pointer' }} />
                  </Tooltip>
                </Box>
                <TextField
                  name="status"
                  select
                  value={formData.status}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('status')}
                  onBlur={() => setFocusedField(null)}
                  fullWidth
                  disabled={loading}
                  variant="outlined"
                  size="small"
                  sx={getFieldStyles('status')}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: theme.palette[option.color].main,
                          boxShadow: `0 0 12px ${theme.palette[option.color].main}70`
                        }} />
                        <Typography variant="body2">{option.label}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* Start Date - 1/4 width */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.875rem' }}>
                    Start Date
                  </Typography>
                  <CalendarIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                </Box>
                <TextField
                  name="vocStartDate"
                  type="date"
                  value={formData.vocStartDate}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('vocStartDate')}
                  onBlur={() => setFocusedField(null)}
                  fullWidth
                  disabled={loading}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  size="small"
                  sx={getFieldStyles('vocStartDate')}
                />
              </Box>

              {/* End Date - 1/4 width */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.875rem' }}>
                    End Date
                  </Typography>
                  <CalendarIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                </Box>
                <TextField
                  name="vocEndDate"
                  type="date"
                  value={formData.vocEndDate}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('vocEndDate')}
                  onBlur={() => setFocusedField(null)}
                  fullWidth
                  disabled={loading}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  size="small"
                  sx={getFieldStyles('vocEndDate')}
                />
              </Box>
            </Box>

            {/* Row 2: Description Full Width */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.875rem' }}>
                  Project Description
                </Typography>
                <Tooltip title="Explain the purpose, scope, and key objectives of this initiative">
                  <InfoIcon sx={{ fontSize: 16, color: theme.palette.text.secondary, cursor: 'pointer' }} />
                </Tooltip>
              </Box>
              <TextField
                name="description"
                value={formData.description}
                onChange={handleChange}
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField(null)}
                fullWidth
                multiline
                rows={5}
                disabled={loading}
                placeholder="Describe the purpose, scope, and objectives of this VOC initiative..."
                variant="outlined"
                sx={{
                  ...getFieldStyles('description'),
                  '& .MuiOutlinedInput-root': {
                    ...getFieldStyles('description')['& .MuiOutlinedInput-root'],
                    minHeight: '120px'
                  }
                }}
              />
            </Box>

            {/* Row 3: Duration Card */}
            {projectDays > 0 && (
              <Box>
                <Card sx={{ 
                  background: `linear-gradient(135deg, ${theme.palette.info.main}10, ${theme.palette.primary.main}05)`, 
                  border: `1.5px solid ${theme.palette.info.main}30`, 
                  borderRadius: '12px',
                  boxShadow: `0 4px 16px ${theme.palette.info.main}08`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    boxShadow: `0 8px 24px ${theme.palette.info.main}15`,
                    transform: 'translateY(-2px)',
                    borderColor: `${theme.palette.info.main}50`
                  }
                }}>
                  <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Box sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.primary.main})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      boxShadow: `0 4px 12px ${theme.palette.info.main}40`
                    }}>
                      <CalendarIcon sx={{ fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.3, color: theme.palette.primary.main, fontSize: '1rem' }}>
                        {projectDays} days
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        {projectWeeks} weeks • {projectMonths} months
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ProjectDetailsStep