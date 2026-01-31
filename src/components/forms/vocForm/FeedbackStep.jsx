import { 
  Box, Card, CardContent, TextField, Button, Chip, Typography, 
  Checkbox, Autocomplete, IconButton, InputAdornment, MenuItem,
  CircularProgress, Alert
} from '@mui/material'
import { 
  Feedback as FeedbackIcon, Add as AddIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ExpandMore as ExpandIcon, CheckCircle as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import { useState, useMemo, useCallback } from 'react'
import MarkdownEditor from '../../common/MarkdownEditor'

const FeedbackStep = ({ 
  formData = {}, 
  feedbacks = [],
  selectedFeedbackCount = 0,
  showFeedbackForm = false,
  setShowFeedbackForm = () => {},
  newFeedback = {},
  setNewFeedback = () => {},
  handleArrayChange = () => {},
  setFeedbacks = () => {},
  setError = () => {},
  feedbackService = null,
  theme
}) => {
  const [searchValue, setSearchValue] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [expandedInDropdown, setExpandedInDropdown] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})

  const selectedIds = formData?.customerDetailsObj?.feedbackID || []

  const handleToggleSelection = (feedbackId) => {
    handleArrayChange('feedbackID', feedbackId, !selectedIds.includes(feedbackId))
  }

  const validateForm = useCallback(() => {
    const errors = {}
    if (!newFeedback.feedbackText?.trim()) errors.feedbackText = 'Feedback text is required'
    if (!newFeedback.rating) errors.rating = 'Rating is required'
    if (!newFeedback.medium) errors.medium = 'Medium is required'
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [newFeedback])

  const handleAddFeedback = useCallback(async () => {
    if (!validateForm()) return
    setIsSubmitting(true)
    setSubmitError(null)
    setSuccessMessage(null)

    try {
      if (!feedbackService) throw new Error('Feedback service is not available')
      
      const feedbackData = {
        feedbackText: newFeedback.feedbackText.trim(),
        rating: newFeedback.rating,
        medium: newFeedback.medium,
        customerId: formData?.customerDetailsObj?.customerID,
        feedbackType: 'general'
      }

      const createdFeedback = await feedbackService.create(feedbackData)
      if (!createdFeedback) throw new Error('Failed to create feedback')

      setFeedbacks(prev => [...(Array.isArray(prev) ? prev : []), createdFeedback])
      setNewFeedback({ feedbackText: '', rating: 5, medium: 'Email' })
      setShowFeedbackForm(false)
      setValidationErrors({})
      setSuccessMessage('Feedback created successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error) {
      console.error('Failed to create feedback:', error)
      const errorMessage = error?.message || 'Failed to create feedback. Please try again.'
      setSubmitError(errorMessage)
      setError?.(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }, [newFeedback, validateForm, feedbackService, formData, setFeedbacks, setNewFeedback, setShowFeedbackForm, setError])

  const handleCancelForm = useCallback(() => {
    setShowFeedbackForm(false)
    setValidationErrors({})
    setSubmitError(null)
    setNewFeedback({ feedbackText: '', rating: 5, medium: 'Email' })
  }, [setShowFeedbackForm, setNewFeedback])

  return (
    <Box sx={{ p: 2, borderTop: `2px solid #ccc` }}>
      <Card sx={{ 
        borderRadius: '20px', 
        boxShadow: `0 8px 32px ${theme.palette.success.main}08`,
        border: `1px solid ${theme.palette.success.main}15`,
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.success.main}01 100%)`,
        overflow: 'hidden',
        position: 'relative'
      }}>


        <CardContent sx={{ p: 4 }}>
          {successMessage && (
            <Alert severity="success" onClose={() => setSuccessMessage(null)} sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}
          {submitError && (
            <Alert severity="error" onClose={() => setSubmitError(null)} sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          {!showFeedbackForm && (
            <Box sx={{
              display: 'flex',
              gap: 2,
              mb: 2,
              alignItems: 'center'
            }}>
              <Chip
                label={`${selectedFeedbackCount || selectedIds.length} Selected`}
                size="small"
                sx={{
                  backgroundColor: (selectedFeedbackCount || selectedIds.length) > 0 ? theme.palette.success.main : theme.palette.grey[300],
                  color: 'white',
                  fontWeight: 600
                }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowFeedbackForm(true)}
                size="small"
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  ml: 'auto',
                  backgroundColor: theme.palette.success.main
                }}
              >
                Add Feedback
              </Button>
            </Box>
          )}

          {!showFeedbackForm && (
            <Box sx={{ mb: 2 }}>
              <Autocomplete
                freeSolo
                open={dropdownOpen}
                onOpen={() => setDropdownOpen(true)}
                onClose={() => setDropdownOpen(false)}
                options={feedbacks}
                getOptionLabel={(option) => option.feedbackText || option.description || ''}
                inputValue={searchValue}
                onInputChange={(event, newInputValue) => {
                  setSearchValue(newInputValue)
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search feedback..."
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            sx={{
                              color: theme.palette.success.main,
                              transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s ease'
                            }}
                          >
                            <ArrowDropDownIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&.Mui-focused': {
                          boxShadow: `0 8px 24px ${theme.palette.success.main}25`
                        }
                      }
                    }}
                  />
                )}
                renderOption={(props, option, { index }) => {
                  const feedbackId = option._id || option.id
                  const isSelected = selectedIds.includes(feedbackId)
                  const isExpanded = expandedInDropdown === feedbackId
                  
                  return (
                    <Box key={feedbackId || index}>
                      <Box 
                        sx={{ 
                          p: 2, 
                          cursor: 'pointer',
                          backgroundColor: isSelected ? theme.palette.success.main + '08' : 'transparent',
                          '&:hover': {
                            backgroundColor: isSelected ? theme.palette.success.main + '12' : theme.palette.action.hover
                          }
                        }}
                        onClick={() => handleToggleSelection(feedbackId)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Checkbox
                            checked={isSelected}
                            size="small"
                            sx={{
                              p: 0,
                              '&.Mui-checked': { color: theme.palette.success.main }
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                              {(option.feedbackText || option.description || 'No feedback text').substring(0, 50)}...
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                              <Chip 
                                label={`${option.rating || 0} Stars`} 
                                size="small" 
                                sx={{
                                  fontSize: '0.65rem', 
                                  height: '16px',
                                  backgroundColor: theme.palette.warning.main + '15',
                                  color: theme.palette.warning.main
                                }}
                              />
                              {option.medium && (
                                <Chip 
                                  label={option.medium} 
                                  size="small" 
                                  sx={{
                                    fontSize: '0.65rem', 
                                    height: '16px',
                                    backgroundColor: theme.palette.info.main + '15',
                                    color: theme.palette.info.main
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation()
                              setExpandedInDropdown(isExpanded ? null : feedbackId)
                            }}
                            sx={{
                              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s ease'
                            }}
                          >
                            <ExpandIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      </Box>
                      {isExpanded && (
                        <Box sx={{ 
                          p: 2, 
                          backgroundColor: theme.palette.grey[50]
                        }}>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                            Full Feedback:
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {option.feedbackText || option.description || 'No feedback provided'}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )
                }}
                noOptionsText="No feedback found"
              />

              {selectedIds.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Selected Feedback ({selectedIds.length})
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedIds.map(id => {
                      const feedback = feedbacks.find(f => (f._id || f.id) === id)
                      if (!feedback) return null
                      return (
                        <Chip
                          key={id}
                          label={(feedback.feedbackText || feedback.description || 'Feedback').substring(0, 30) + '...'}
                          onDelete={() => handleToggleSelection(id)}
                          size="small"
                          sx={{
                            backgroundColor: theme.palette.success.main + '15',
                            color: theme.palette.success.main
                          }}
                        />
                      )
                    })}
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {showFeedbackForm && (
            <Card sx={{ p: 2, borderRadius: '12px', border: `1px solid ${theme.palette.success.main}20` }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Add Feedback</Typography>
                <IconButton size="small" onClick={handleCancelForm}>
                  <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Feedback Text
                  </Typography>
                  <MarkdownEditor
                    value={newFeedback.feedbackText || ''}
                    onChange={(value) => setNewFeedback(prev => ({ ...prev, feedbackText: value }))}
                    placeholder="Enter feedback text..."
                    disabled={isSubmitting}
                    height={200}
                    error={!!validationErrors.feedbackText}
                    helperText={validationErrors.feedbackText}
                  />
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                  <TextField
                    label="Rating"
                    select
                    value={newFeedback.rating || 5}
                    onChange={(e) => setNewFeedback(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    size="small"
                    error={!!validationErrors.rating}
                  >
                    {[1,2,3,4,5].map(num => (
                      <MenuItem key={num} value={num}>{num}★</MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Medium"
                    select
                    value={newFeedback.medium || 'Email'}
                    onChange={(e) => setNewFeedback(prev => ({ ...prev, medium: e.target.value }))}
                    size="small"
                    error={!!validationErrors.medium}
                  >
                    <MenuItem value="Email">Email</MenuItem>
                    <MenuItem value="Phone">Phone</MenuItem>
                    <MenuItem value="Survey">Survey</MenuItem>
                    <MenuItem value="Chat">Chat</MenuItem>
                  </TextField>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button size="small" onClick={handleCancelForm} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button 
                    size="small"
                    variant="contained" 
                    onClick={handleAddFeedback}
                    disabled={isSubmitting}
                    sx={{ backgroundColor: theme.palette.success.main }}
                  >
                    {isSubmitting ? 'Creating...' : 'Create'}
                  </Button>
                </Box>
              </Box>
            </Card>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default FeedbackStep