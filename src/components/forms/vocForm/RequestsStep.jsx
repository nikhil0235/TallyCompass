import { 
  Box, Card, CardContent, TextField, MenuItem, Button, Chip, Typography, 
  Grid, CircularProgress, Alert, Dialog, 
  DialogTitle, DialogContent, DialogActions, Checkbox,
  Autocomplete, Paper, IconButton, InputAdornment
} from '@mui/material'
import { 
  Assignment as ProjectIcon, Add as AddIcon, Delete as DeleteIcon,
  Close as CloseIcon, CheckCircle as CheckIcon,
  Clear as ClearIcon, ArrowDropDown as ArrowDropDownIcon,
  ExpandMore as ExpandIcon
} from '@mui/icons-material'
import { useState, useCallback, useMemo, memo, useEffect } from 'react'
import MarkdownEditor from '../../common/MarkdownEditor'

const REQUEST_TYPES = [
  { value: 'feature', label: 'Feature Request' },
  { value: 'issue', label: 'Issue' }
]

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
]

const RequestCard = memo(({ 
  request, 
  isSelected = false, 
  onToggle = () => {}, 
  theme,
  onExpand = () => {}
}) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'feature': return theme.palette.primary.main
      case 'issue': return theme.palette.error.main
      default: return theme.palette.grey[400]
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'feature': return 'Feature'
      case 'issue': return 'Issue'
      default: return type
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return theme.palette.error.main
      case 'medium': return theme.palette.warning.main
      case 'low': return theme.palette.success.main
      default: return theme.palette.grey[400]
    }
  }

  if (!request || (!request._id && !request.id)) return null

  return (
    <Card
      sx={{
        transition: 'all 0.2s ease',
        border: `2px solid ${isSelected ? theme.palette.primary.main : theme.palette.grey[200]}`,
        backgroundColor: isSelected ? theme.palette.primary.main + '08' : theme.palette.background.paper,
        '&:hover': {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 4px 12px ${theme.palette.primary.main}15`,
          transform: 'translateY(-2px)'
        },
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '8px',
        minHeight: '80px',
        cursor: 'pointer'
      }}
      onClick={() => onToggle(request._id || request.id)}
    >
      <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}>
        <Checkbox
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation()
            onToggle(request._id || request.id)
          }}
          sx={{
            padding: 0.5,
            color: theme.palette.grey[400],
            '&.Mui-checked': { color: theme.palette.primary.main }
          }}
        />
      </Box>

      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation()
          onExpand()
        }}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          color: theme.palette.text.secondary,
          '&:hover': {
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.main + '08'
          }
        }}
      >
        <ExpandIcon sx={{ fontSize: 18 }} />
      </IconButton>

      <CardContent
        sx={{
          p: 2,
          paddingLeft: '36px',
          paddingRight: '36px'
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            fontSize: '0.85rem',
            mb: 1,
            lineHeight: 1.3,
            color: theme.palette.text.primary,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {request.title || request.requestTitle || 'Untitled Request'}
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          <Chip
            label={getTypeLabel(request.requestType)}
            size="small"
            sx={{
              height: '18px',
              fontSize: '0.65rem',
              backgroundColor: getTypeColor(request.requestType) + '15',
              color: getTypeColor(request.requestType),
              fontWeight: 600,
              '& .MuiChip-label': { px: 0.5 }
            }}
          />
          {request.priority && (
            <Chip
              label={request.priority.charAt(0).toUpperCase()}
              size="small"
              sx={{
                height: '18px',
                fontSize: '0.65rem',
                backgroundColor: getPriorityColor(request.priority) + '15',
                color: getPriorityColor(request.priority),
                fontWeight: 600,
                minWidth: '18px',
                '& .MuiChip-label': { px: 0.5 }
              }}
            />
          )}
        </Box>

        {isSelected && (
          <Box
            sx={{
              mt: 1,
              pt: 1,
              borderTop: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <CheckIcon sx={{ fontSize: 12, color: theme.palette.primary.main }} />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: theme.palette.primary.main,
                fontSize: '0.65rem'
              }}
            >
              Selected
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
})

RequestCard.displayName = 'RequestCard'

const RequestsStep = ({ 
  formData = {}, 
  customerRequests = [],
  selectedRequestCount = 0,
  showRequestForm = false, 
  setShowRequestForm = () => {},
  newRequest = {},
  setNewRequest = () => {},
  handleArrayChange = () => {},
  setCustomerRequests = () => {},
  setError = () => {},
  customerRequestService = null,
  theme,
  setFormData = null
}) => {
  const [searchValue, setSearchValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [localSelectedIds, setLocalSelectedIds] = useState([])
  const [expandedRequest, setExpandedRequest] = useState(null)
  const [openRequestDetails, setOpenRequestDetails] = useState(false)
  const [expandedInDropdown, setExpandedInDropdown] = useState(null)

  const filteredRequests = useMemo(() => {
    if (!Array.isArray(customerRequests)) return []
    
    const searchTerm = searchValue.toLowerCase()
    return customerRequests.filter(request => {
      const title = (request?.requestTitle || request?.title || '').toLowerCase()
      const desc = (request?.description || '').toLowerCase()
      const type = (request?.requestType || request?.type || '').toLowerCase()
      
      return title.includes(searchTerm) || desc.includes(searchTerm) || type.includes(searchTerm)
    })
  }, [customerRequests, searchValue])

  const selectedIds = localSelectedIds
  
  // Sync with parent form data
  useEffect(() => {
    const parentIds = formData?.customerDetailsObj?.customerRequestID || []
    setLocalSelectedIds(parentIds)
  }, [formData?.customerDetailsObj?.customerRequestID])

  const validateForm = useCallback(() => {
    const errors = {}
    
    if (!newRequest.requestTitle?.trim()) {
      errors.requestTitle = 'Request title is required'
    }
    if (!newRequest.description?.trim()) {
      errors.description = 'Description is required'
    }
    if (!newRequest.requestType) {
      errors.requestType = 'Request type is required'
    }
    if (!newRequest.priority) {
      errors.priority = 'Priority is required'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [newRequest])

  const handleAddRequest = useCallback(async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitError(null)
    setSuccessMessage(null)

    try {
      if (!customerRequestService) {
        throw new Error('Customer request service is not available')
      }

      const requestData = {
        requestTitle: newRequest.requestTitle.trim(),
        description: newRequest.description.trim(),
        requestType: newRequest.requestType,
        priority: newRequest.priority,
        customterList: formData?.customerDetailsObj?.customerID 
          ? [formData.customerDetailsObj.customerID] 
          : [],
        action: {
          status: 'pending',
          description: 'Request created from VOC form'
        }
      }

      const createdRequest = await customerRequestService.create(requestData)
      
      if (!createdRequest) {
        throw new Error('Failed to create request')
      }

      setCustomerRequests(prev => [...(Array.isArray(prev) ? prev : []), createdRequest])
      setNewRequest({ requestTitle: '', description: '', requestType: 'feature', priority: 'medium' })
      setShowRequestForm(false)
      setValidationErrors({})
      setSuccessMessage('Request created successfully!')
      
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error) {
      console.error('Failed to create request:', error)
      const errorMessage = error?.message || 'Failed to create request. Please try again.'
      setSubmitError(errorMessage)
      setError?.(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }, [newRequest, validateForm, customerRequestService, formData, setCustomerRequests, setNewRequest, setShowRequestForm, setError])



  const handleToggleSelection = useCallback((requestId) => {
    const newSelectedIds = localSelectedIds.includes(requestId)
      ? localSelectedIds.filter(id => id !== requestId)
      : [...localSelectedIds, requestId]
    
    setLocalSelectedIds(newSelectedIds)
    
    if (setFormData) {
      setFormData({
        ...formData,
        customerDetailsObj: {
          ...formData.customerDetailsObj,
          customerRequestID: newSelectedIds
        }
      })
    }
  }, [localSelectedIds, formData, setFormData])

  const handleClearSelection = useCallback(() => {
    setLocalSelectedIds([])
    
    if (setFormData) {
      setFormData({
        ...formData,
        customerDetailsObj: {
          ...formData.customerDetailsObj,
          customerRequestID: []
        }
      })
    }
  }, [formData, setFormData])

  const handleCancelForm = useCallback(() => {
    setShowRequestForm(false)
    setValidationErrors({})
    setSubmitError(null)
    setNewRequest({ requestTitle: '', description: '', requestType: 'feature', priority: 'medium' })
  }, [setShowRequestForm, setNewRequest])

  return (
    <Box sx={{ p: 2, borderTop: `2px solid #ccc` }}>
      <Card sx={{ 
        borderRadius: '20px', 
        boxShadow: `0 8px 32px ${theme.palette.primary.main}08`,
        border: `1px solid ${theme.palette.primary.main}15`,
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.main}01 100%)`,
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: `0 12px 40px ${theme.palette.primary.main}12`,
          borderColor: `${theme.palette.primary.main}20`
        }
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

          {!showRequestForm && (
            <Box sx={{
              display: 'flex',
              gap: 2,
              mb: 2,
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <Chip
                label={`${selectedRequestCount || selectedIds.length} Selected`}
                size="small"
                sx={{
                  backgroundColor: (selectedRequestCount || selectedIds.length) > 0 ? theme.palette.success.main : theme.palette.grey[300],
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowRequestForm(true)}
                size="small"
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  whiteSpace: 'nowrap',
                  ml: 'auto'
                }}
              >
                Add Request
              </Button>
            </Box>
          )}

          {!showRequestForm && (
            <Box sx={{ mb: 2 }}>
              <Autocomplete
                freeSolo
                open={dropdownOpen}
                onOpen={() => setDropdownOpen(true)}
                onClose={() => setDropdownOpen(false)}
                options={customerRequests}
                getOptionLabel={(option) => option.title || option.requestTitle || ''}
                inputValue={searchValue}
                onInputChange={(event, newInputValue) => {
                  setSearchValue(newInputValue)
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search by title or description..."
                    size="small"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            sx={{
                              color: theme.palette.primary.main,
                              transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s ease',
                              '&:hover': {
                                backgroundColor: theme.palette.primary.main + '08'
                              }
                            }}
                          >
                            <ArrowDropDownIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      flex: 1,
                      minWidth: '200px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        background: 'rgba(255,255,255,0.6)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        border: `1.5px solid ${theme.palette.grey[300]}`,
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
                    }}
                  />
                )}
                renderOption={(props, option, { index }) => {
                  const uniqueKey = option._id ? `autocomplete-${option._id}` : `autocomplete-option-${index}`
                  const requestId = option._id || option.id
                  const isSelected = selectedIds.includes(requestId)
                  const isExpanded = expandedInDropdown === requestId
                  
                  return (
                    <Box key={uniqueKey}>
                      <Box 
                        sx={{ 
                          p: 2, 
                          minHeight: '50px', 
                          borderBottom: `1px solid ${theme.palette.divider}`, 
                          width: '100%',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? theme.palette.primary.main + '08' : 'transparent',
                          '&:hover': {
                            backgroundColor: isSelected ? theme.palette.primary.main + '12' : theme.palette.action.hover
                          }
                        }}
                        onClick={() => {
                          if (requestId) {
                            handleToggleSelection(requestId)
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                          <Checkbox
                            checked={isSelected}
                            size="small"
                            sx={{
                              p: 0,
                              color: theme.palette.grey[400],
                              '&.Mui-checked': { color: theme.palette.primary.main }
                            }}
                          />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                              {option.title || option.requestTitle || 'Untitled Request'}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                              <Chip 
                                label={option.requestType === 'feature' ? 'Feature' : 'Issue'} 
                                size="small" 
                                sx={{
                                  fontSize: '0.65rem', 
                                  height: '16px',
                                  backgroundColor: option.requestType === 'feature' ? theme.palette.primary.main + '15' : theme.palette.error.main + '15',
                                  color: option.requestType === 'feature' ? theme.palette.primary.main : theme.palette.error.main,
                                  fontWeight: 600,
                                  '& .MuiChip-label': { px: 0.5 }
                                }}
                              />
                              {option.priority && (
                                <Chip 
                                  label={option.priority.charAt(0).toUpperCase() + option.priority.slice(1)} 
                                  size="small" 
                                  sx={{
                                    fontSize: '0.65rem', 
                                    height: '16px',
                                    backgroundColor: option.priority === 'high' ? theme.palette.error.main + '15' : option.priority === 'medium' ? theme.palette.warning.main + '15' : theme.palette.success.main + '15',
                                    color: option.priority === 'high' ? theme.palette.error.main : option.priority === 'medium' ? theme.palette.warning.main : theme.palette.success.main,
                                    fontWeight: 600,
                                    '& .MuiChip-label': { px: 0.5 }
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                setExpandedInDropdown(isExpanded ? null : requestId)
                              }}
                              sx={{
                                color: theme.palette.text.secondary,
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s ease',
                                '&:hover': {
                                  color: theme.palette.primary.main,
                                  backgroundColor: theme.palette.primary.main + '08'
                                }
                              }}
                            >
                              <ExpandIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                      {isExpanded && (
                        <Box sx={{ 
                          p: 2, 
                          backgroundColor: theme.palette.grey[50],
                          borderBottom: `1px solid ${theme.palette.divider}`
                        }}>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                            Description:
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                            {option.description || 'No description provided'}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip 
                              label={option.requestType === 'feature' ? 'Feature Request' : 'Issue'} 
                              size="small" 
                              color={option.requestType === 'feature' ? 'primary' : 'error'}
                            />
                            {option.priority && (
                              <Chip 
                                label={`${option.priority.charAt(0).toUpperCase()}${option.priority.slice(1)} Priority`} 
                                size="small" 
                                color={option.priority === 'high' ? 'error' : option.priority === 'medium' ? 'warning' : 'success'}
                              />
                            )}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  )
                }}
                PaperComponent={(props) => (
                  <Paper {...props} sx={{ 
                    borderRadius: '12px', 
                    boxShadow: `0 8px 20px ${theme.palette.primary.main}15`,
                    border: `1px solid ${theme.palette.divider}`,
                    mt: 1
                  }} />
                )}
                noOptionsText="No requests found"
                sx={{ flex: 1 }}
              />

              {selectedIds.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Selected Requests ({selectedIds.length})
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedIds.map(id => {
                      const request = customerRequests.find(r => (r._id || r.id) === id)
                      if (!request) return null
                      return (
                        <Chip
                          key={id}
                          label={request.title || request.requestTitle || 'Untitled'}
                          onDelete={() => handleToggleSelection(id)}
                          size="small"
                          sx={{
                            backgroundColor: theme.palette.primary.main + '15',
                            color: theme.palette.primary.main,
                            '& .MuiChip-deleteIcon': {
                              color: theme.palette.primary.main + '80',
                              '&:hover': {
                                color: theme.palette.primary.main
                              }
                            }
                          }}
                        />
                      )
                    })}
                  </Box>
                </Box>
              )}




            </Box>
          )}

          {showRequestForm && (
            <Card sx={{
              borderRadius: '20px',
              boxShadow: `0 12px 48px ${theme.palette.primary.main}08`,
              border: `1.5px solid ${theme.palette.primary.main}15`,
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.main}01 100%)`,
              overflow: 'hidden',
              position: 'relative',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              mb: 3,
              '&:hover': {
                boxShadow: `0 20px 64px ${theme.palette.primary.main}12`,
                borderColor: `${theme.palette.primary.main}25`
              }
            }}>
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.info.main}, ${theme.palette.success.main})`,
                backgroundSize: '200% 100%',
                animation: 'gradientShift 6s ease infinite',
                '@keyframes gradientShift': {
                  '0%': { backgroundPosition: '0% center' },
                  '50%': { backgroundPosition: '100% center' },
                  '100%': { backgroundPosition: '0% center' }
                }
              }} />

              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 4px 12px ${theme.palette.primary.main}40`
                    }}>
                      <AddIcon sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.2rem', mb: 0.3, color: theme.palette.primary.main }}>
                        Create New Request
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.85rem', fontWeight: 500 }}>
                        Add a new customer request to track and manage
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    onClick={handleCancelForm}
                    sx={{
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        color: theme.palette.error.main,
                        backgroundColor: theme.palette.error.main + '08',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>

                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 3,
                  mb: 4
                }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.875rem' }}>
                        Request Type
                      </Typography>
                    </Box>
                    <TextField
                      select
                      value={newRequest.requestType || 'feature'}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, requestType: e.target.value }))}
                      fullWidth
                      error={!!validationErrors.requestType}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          fontSize: '0.95rem',
                          background: 'rgba(255,255,255,0.6)',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          border: `1.5px solid ${theme.palette.grey[300]}`,
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
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                      }}
                    >
                      {REQUEST_TYPES.map(type => (
                        <MenuItem key={type.value} value={type.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              background: type.value === 'feature' ? theme.palette.primary.main : theme.palette.error.main,
                              boxShadow: `0 0 12px ${type.value === 'feature' ? theme.palette.primary.main : theme.palette.error.main}70`
                            }} />
                            <Typography variant="body2">{type.label}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.875rem' }}>
                        Priority Level
                      </Typography>
                    </Box>
                    <TextField
                      select
                      value={newRequest.priority || 'medium'}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, priority: e.target.value }))}
                      fullWidth
                      error={!!validationErrors.priority}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          fontSize: '0.95rem',
                          background: 'rgba(255,255,255,0.6)',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          border: `1.5px solid ${theme.palette.grey[300]}`,
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
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                      }}
                    >
                      {PRIORITY_LEVELS.map(level => {
                        const color = level.value === 'high' ? theme.palette.error.main : 
                                     level.value === 'medium' ? theme.palette.warning.main : theme.palette.success.main
                        return (
                          <MenuItem key={level.value} value={level.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                background: color,
                                boxShadow: `0 0 12px ${color}70`
                              }} />
                              <Typography variant="body2">{level.label}</Typography>
                            </Box>
                          </MenuItem>
                        )
                      })}
                    </TextField>
                  </Box>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.875rem' }}>
                      Request Title
                    </Typography>
                  </Box>
                  <TextField
                    value={newRequest.requestTitle || ''}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, requestTitle: e.target.value }))}
                    fullWidth
                    error={!!validationErrors.requestTitle}
                    helperText={validationErrors.requestTitle}
                    placeholder="e.g., Add dark mode support, Fix login issue"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        fontSize: '0.95rem',
                        background: 'rgba(255,255,255,0.6)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        border: `1.5px solid ${theme.palette.grey[300]}`,
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
                      '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                    }}
                  />
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.875rem' }}>
                      Detailed Description
                    </Typography>
                  </Box>
                  <MarkdownEditor
                    value={newRequest.description || ''}
                    onChange={(value) => setNewRequest(prev => ({ ...prev, description: value }))}
                    placeholder="Describe the request in detail..."
                    disabled={isSubmitting}
                    height={250}
                    error={!!validationErrors.description}
                    helperText={validationErrors.description}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                  <Button
                    onClick={handleCancelForm}
                    disabled={isSubmitting}
                    variant="outlined"
                    sx={{
                      fontSize: '0.9rem',
                      borderRadius: '12px',
                      px: 3,
                      py: 1.2,
                      textTransform: 'none',
                      fontWeight: 600,
                      border: `1.5px solid ${theme.palette.grey[300]}`,
                      '&:hover': {
                        borderColor: theme.palette.error.main,
                        color: theme.palette.error.main,
                        backgroundColor: theme.palette.error.main + '08'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleAddRequest}
                    disabled={isSubmitting}
                    endIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <CheckIcon />}
                    sx={{
                      fontSize: '0.9rem',
                      borderRadius: '12px',
                      px: 4,
                      py: 1.2,
                      textTransform: 'none',
                      fontWeight: 600,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
                      boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.info.dark})`,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 24px ${theme.palette.primary.main}60`
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Request'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Dialog 
        open={openRequestDetails} 
        onClose={() => setOpenRequestDetails(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
          Request Details
        </DialogTitle>
        <DialogContent>
          {expandedRequest && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                {expandedRequest.title || expandedRequest.requestTitle || 'Untitled Request'}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip 
                  label={expandedRequest.requestType === 'feature' ? 'Feature Request' : 'Issue'} 
                  size="small" 
                  color={expandedRequest.requestType === 'feature' ? 'primary' : 'error'}
                />
                {expandedRequest.priority && (
                  <Chip 
                    label={`${expandedRequest.priority.charAt(0).toUpperCase()}${expandedRequest.priority.slice(1)} Priority`} 
                    size="small" 
                    color={expandedRequest.priority === 'high' ? 'error' : expandedRequest.priority === 'medium' ? 'warning' : 'success'}
                  />
                )}
              </Box>
              
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Description:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                {expandedRequest.description || 'No description provided'}
              </Typography>
              
              {expandedRequest.status && (
                <>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Status:
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    {expandedRequest.status}
                  </Typography>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRequestDetails(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default RequestsStep