import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Alert,
  CircularProgress,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Fade,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  FormControlLabel,
  styled,
  Chip,
  Divider,
  useTheme,
  LinearProgress,
  Paper,
  Tooltip,
  Badge,
  AvatarGroup,
  Avatar,
} from '@mui/material'
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Assignment as ProjectIcon,
  Person as CustomerIcon,
  Feedback as FeedbackIcon,
  AttachFile as MediaIcon,
  FileUpload as UploadIcon,
  ArrowRight as ArrowIcon,
  TrendingUp as TrendingIcon,
  CalendarToday as CalendarIcon,
  BuildCircle as BuildIcon,
  Lightbulb as LightbulbIcon,
  Star as StarIcon,
  Description as FileIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { closeModal } from '../../store/slices/uiSlice'
import { createVocSuccess, updateVocSuccess, vocFailure } from '../../store/slices/vocSlice'
import vocService from '../../services/vocService'
import customerService from '../../services/customerService'
import feedbackService from '../../services/feedbackService'
import customerRequestService from '../../services/customerRequestService'

const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    borderColor: theme.palette.divider,
    borderWidth: 3,
    height: 4,
    backgroundColor: theme.palette.divider,
  },
  '&.Mui-active': {
    '& .MuiStepConnector-line': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 16px ${theme.palette.primary.main}70`,
      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    },
  },
  '&.Mui-completed': {
    '& .MuiStepConnector-line': {
      borderColor: theme.palette.success.main,
      boxShadow: `0 0 16px ${theme.palette.success.main}70`,
      background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.info.main})`,
    },
  },
}))

const steps = [
  { label: 'Project Details', icon: <BuildIcon />, description: 'Name and timeline', color: 'info' },
  { label: 'Customer', icon: <CustomerIcon />, description: 'Select & configure', color: 'warning' },
  { label: 'Requests', icon: <ProjectIcon />, description: 'Link requests', color: 'error' },
  { label: 'Feedback', icon: <FeedbackIcon />, description: 'Link feedback', color: 'success' },
  { label: 'Media', icon: <MediaIcon />, description: 'Upload files', color: 'secondary' },
  { label: 'Review', icon: <CheckIcon />, description: 'Final summary', color: 'primary' }
]

const STATUS_OPTIONS = [
  { value: 'Upcoming', label: 'Upcoming', color: 'info' },
  { value: 'Ongoing', label: 'Ongoing', color: 'warning' },
  { value: 'Completed', label: 'Completed', color: 'success' },
  { value: 'Cancelled', label: 'Cancelled', color: 'error' }
]

const CUSTOMER_STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending', icon: <LockIcon sx={{ fontSize: 16 }} /> },
  { value: 'Completed', label: 'Completed', icon: <CheckIcon sx={{ fontSize: 16 }} /> },
  { value: 'Cancelled', label: 'Cancelled', icon: <ErrorIcon sx={{ fontSize: 16 }} /> }
]

const INITIAL_FORM_STATE = {
  projectName: '',
  description: '',
  status: 'Upcoming',
  vocStartDate: '',
  vocEndDate: '',
  customerDetailsObj: {
    customerID: '',
    feedbackID: [],
    customerRequestID: [],
    status: 'Pending'
  },
  mediaList: []
}

const RequestCard = ({ request, isSelected, onToggle, theme }) => (
  <Card
    onClick={() => onToggle(request._id)}
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
        background: `linear-gradient(90deg, ${theme.palette.error.main}, ${theme.palette.warning.main})`,
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
          onChange={() => onToggle(request._id)}
          sx={{ mt: -0.5, flexShrink: 0 }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, fontSize: '0.95rem' }}>
            {request.title || request.requestTitle || 'Untitled Request'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontSize: '0.85rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {request.description?.substring(0, 80) || 'No description'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            <Chip
              icon={request.type === 'feature' ? <LightbulbIcon /> : <BuildIcon />}
              label={request.type || request.requestType || 'General'}
              size="small"
              variant="outlined"
              sx={{
                height: '24px',
                fontSize: '0.7rem',
                fontWeight: 600,
                borderColor: request.type === 'feature' ? theme.palette.info.main : theme.palette.error.main,
                color: request.type === 'feature' ? theme.palette.info.main : theme.palette.error.main,
              }}
            />
            <Chip
              label={request.priority || 'medium'}
              size="small"
              sx={{
                height: '24px',
                fontSize: '0.7rem',
                fontWeight: 600,
                background: (request.priority || 'medium') === 'high' ? theme.palette.error.main : (request.priority || 'medium') === 'medium' ? theme.palette.warning.main : theme.palette.success.main,
                color: 'white'
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

const StatBox = ({ icon: Icon, label, value, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      borderRadius: '12px',
      background: `linear-gradient(135deg, ${color}15, ${color}08)`,
      border: `2px solid ${color}30`,
      textAlign: 'center',
      transition: 'all 0.3s ease',
      '&:hover': {
        border: `2px solid ${color}80`,
        boxShadow: `0 8px 24px ${color}20`,
        transform: 'translateY(-2px)',
      }
    }}
  >
    <Icon sx={{ fontSize: 24, color, mb: 1 }} />
    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.3rem' }}>
      {value}
    </Typography>
    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
      {label}
    </Typography>
  </Paper>
)

const VocForm = () => {
  const { modals, modalData } = useSelector((state) => state.ui)
  const dispatch = useDispatch()
  const theme = useTheme()

  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState(INITIAL_FORM_STATE)
  const [customers, setCustomers] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [customerRequests, setCustomerRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [newRequest, setNewRequest] = useState({ requestTitle: '', description: '', requestType: 'feature', priority: 'medium' })
  const [newFeedback, setNewFeedback] = useState({ feedbackText: '', rating: 5, medium: 'Email' })
  const [uploadedFiles, setUploadedFiles] = useState([])

  const isOpen = modals?.vocForm
  const isEditMode = Boolean(modalData?._id)
  const dialogTitle = isEditMode ? 'Edit VOC' : 'Create New VOC '
  const submitButtonText = isEditMode ? 'Update' : 'Create'

  const selectedCustomer = customers.find(c => c._id === formData.customerDetailsObj.customerID)
  const selectedRequestCount = formData.customerDetailsObj.customerRequestID.length
  const selectedFeedbackCount = formData.customerDetailsObj.feedbackID.length
  const projectDays = formData.vocStartDate && formData.vocEndDate ? 
    Math.ceil((new Date(formData.vocEndDate) - new Date(formData.vocStartDate)) / (1000 * 60 * 60 * 24)) : 0

  const loadData = useCallback(async () => {
    try {
      setDataLoading(true)
      setError('')
      const [customersData, feedbacksData, requestsData] = await Promise.all([
        customerService.getAll(),
        feedbackService.getAll(),
        customerRequestService.getAll()
      ])
      setCustomers(Array.isArray(customersData) ? customersData : [])
      setFeedbacks(Array.isArray(feedbacksData) ? feedbacksData : [])
      setCustomerRequests(Array.isArray(requestsData) ? requestsData : [])
    } catch (err) {
      console.error('Failed to load data:', err)
      setError('Failed to load required data. Please try again.')
    } finally {
      setDataLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      loadData()
      setError('')
      setSuccess(false)
      
      if (modalData && modalData._id) {
        setFormData({
          projectName: modalData.projectName || '',
          description: modalData.description || '',
          status: modalData.status || 'Upcoming',
          vocStartDate: modalData.vocStartDate ? modalData.vocStartDate.split('T')[0] : '',
          vocEndDate: modalData.vocEndDate ? modalData.vocEndDate.split('T')[0] : '',
          customerDetailsObj: {
            customerID: modalData.customerDetailsObj?.customerID || '',
            feedbackID: modalData.customerDetailsObj?.feedbackID || [],
            customerRequestID: modalData.customerDetailsObj?.customerRequestID || [],
            status: modalData.customerDetailsObj?.status || 'Pending'
          },
          mediaList: modalData.mediaList || []
        })
      } else {
        setFormData(INITIAL_FORM_STATE)
        setActiveStep(0)
      }
    }
  }, [isOpen, modalData, loadData])

  const handleClose = useCallback(() => {
    dispatch(closeModal('vocForm'))
    setFormData(INITIAL_FORM_STATE)
    setActiveStep(0)
    setError('')
    setSuccess(false)
  }, [dispatch])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    
    if (name.startsWith('customerDetailsObj.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        customerDetailsObj: { ...prev.customerDetailsObj, [field]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }, [])

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const handleArrayChange = (field, id, checked) => {
    setFormData(prev => ({
      ...prev,
      customerDetailsObj: {
        ...prev.customerDetailsObj,
        [field]: checked 
          ? [...prev.customerDetailsObj[field], id]
          : prev.customerDetailsObj[field].filter(item => item !== id)
      }
    }))
  }

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    
    try {
      setError('')
      setSuccess(false)
      setLoading(true)

      let result
      if (isEditMode) {
        result = await vocService.update(modalData._id, formData)
        dispatch(updateVocSuccess(result))
      } else {
        result = await vocService.create(formData)
        dispatch(createVocSuccess(result))
      }
      
      setSuccess(true)
      setTimeout(() => {
        handleClose()
      }, 1500)
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred'
      setError(errorMessage)
      dispatch(vocFailure(errorMessage))
    } finally {
      setLoading(false)
    }
  }, [formData, isEditMode, modalData, dispatch, handleClose])

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 2 }}>
            <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', mb: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: theme.palette.primary.main }}>
                  📋 Project Information
                </Typography>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <TextField
                      name="projectName"
                      label="Project Name"
                      value={formData.projectName}
                      onChange={handleChange}
                      fullWidth
                      required
                      disabled={loading}
                      placeholder="e.g., Q4 2024 Voice of Customer Initiative"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          fontSize: '1.1rem',
                          '&:hover': { boxShadow: `0 4px 12px ${theme.palette.primary.main}15` },
                          '&.Mui-focused': { boxShadow: `0 4px 20px ${theme.palette.primary.main}25` }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="description"
                      label="Project Description"
                      value={formData.description}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={4}
                      disabled={loading}
                      placeholder="Describe the purpose, scope, and objectives of this VOC initiative..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          fontSize: '1rem'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="status"
                      label="Project Status"
                      select
                      value={formData.status}
                      onChange={handleChange}
                      fullWidth
                      disabled={loading}
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: '12px', fontSize: '1rem' }
                      }}
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              background: theme.palette[option.color].main,
                              boxShadow: `0 0 8px ${theme.palette[option.color].main}60`
                            }} />
                            {option.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="vocStartDate"
                      label="Start Date"
                      type="date"
                      value={formData.vocStartDate}
                      onChange={handleChange}
                      fullWidth
                      disabled={loading}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: '12px', fontSize: '1rem' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="vocEndDate"
                      label="End Date"
                      type="date"
                      value={formData.vocEndDate}
                      onChange={handleChange}
                      fullWidth
                      disabled={loading}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: '12px', fontSize: '1rem' }
                      }}
                    />
                  </Grid>
                  {projectDays > 0 && (
                    <Grid item xs={12}>
                      <Card sx={{ 
                        background: `linear-gradient(135deg, ${theme.palette.info.main}12, ${theme.palette.primary.main}08)`, 
                        border: `2px solid ${theme.palette.info.main}40`, 
                        borderRadius: '16px',
                        mt: 2
                      }}>
                        <CardContent sx={{ py: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <CalendarIcon sx={{ color: theme.palette.info.main, fontSize: 32 }} />
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                              Project Duration
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                              {projectDays} days • {Math.ceil(projectDays / 7)} weeks • {Math.ceil(projectDays / 30)} months
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Box>
        )

      case 1:
        return (
          <Box sx={{ p: 2 }}>
            <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: theme.palette.warning.main }}>
                  👥 Customer Selection
                </Typography>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <TextField
                      name="customerDetailsObj.customerID"
                      label="Select Customer"
                      select
                      value={formData.customerDetailsObj.customerID}
                      onChange={handleChange}
                      fullWidth
                      required
                      disabled={loading || dataLoading || customers.length === 0}
                      sx={{
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: '12px',
                          fontSize: '1.1rem',
                          minHeight: '56px'
                        }
                      }}
                    >
                      {customers.map((customer) => (
                        <MenuItem key={customer._id} value={customer._id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', py: 1 }}>
                            <Avatar sx={{ 
                              width: 32, 
                              height: 32, 
                              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
                              fontSize: '0.9rem'
                            }}>
                              {customer.companyName.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {customer.companyName}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {customer.email || 'No email provided'}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {selectedCustomer && (
                    <Grid item xs={12}>
                      <Card sx={{
                        background: `linear-gradient(135deg, ${theme.palette.info.main}12, ${theme.palette.primary.main}08)`,
                        border: `2.5px solid ${theme.palette.primary.main}40`,
                        borderRadius: '16px',
                        mt: 2
                      }}>
                        <CardContent sx={{ p: 4 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                            <Avatar sx={{ 
                              width: 64, 
                              height: 64, 
                              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
                              fontSize: '1.5rem'
                            }}>
                              {selectedCustomer.companyName.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                                {selectedCustomer.companyName}
                              </Typography>
                              <Chip 
                                label="Selected Customer" 
                                size="small" 
                                sx={{ 
                                  background: theme.palette.success.main, 
                                  color: 'white',
                                  fontWeight: 600
                                }} 
                              />
                            </Box>
                          </Box>
                          <Divider sx={{ my: 3 }} />
                          
                          <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                              <Box sx={{ p: 2, borderRadius: '12px', background: 'rgba(255,255,255,0.7)' }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                                  Contact Person
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>
                                  {selectedCustomer.contactPerson || 'Not provided'}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Box sx={{ p: 2, borderRadius: '12px', background: 'rgba(255,255,255,0.7)' }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                                  Email Address
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5, wordBreak: 'break-all' }}>
                                  {selectedCustomer.email || 'Not provided'}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12}>
                              <Box sx={{ p: 2, borderRadius: '12px', background: 'rgba(255,255,255,0.7)' }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', mb: 1, display: 'block' }}>
                                  Customer Status
                                </Typography>
                                <TextField
                                  name="customerDetailsObj.status"
                                  select
                                  value={formData.customerDetailsObj.status}
                                  onChange={handleChange}
                                  size="small"
                                  sx={{ 
                                    minWidth: 200,
                                    '& .MuiOutlinedInput-root': { borderRadius: '8px', background: 'white' } 
                                  }}
                                >
                                  {CUSTOMER_STATUS_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {option.icon}
                                        {option.label}
                                      </Box>
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </Box>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Box>
        )

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.warning.main})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <ProjectIcon />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Customer Requests
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Select relevant feature requests and issues
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setShowRequestForm(true)}
                    sx={{ borderRadius: '8px', textTransform: 'none' }}
                  >
                    Add Request
                  </Button>
                  <Chip
                    label={`${selectedRequestCount} Selected`}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.warning.main})`,
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              {showRequestForm ? (
                <Card sx={{ p: 3, borderRadius: '12px', border: `2px solid ${theme.palette.primary.main}` }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Add New Request</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Request Title"
                        value={newRequest.requestTitle}
                        onChange={(e) => setNewRequest(prev => ({ ...prev, requestTitle: e.target.value }))}
                        fullWidth
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Description"
                        value={newRequest.description}
                        onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                        fullWidth
                        multiline
                        rows={3}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Type"
                        select
                        value={newRequest.requestType}
                        onChange={(e) => setNewRequest(prev => ({ ...prev, requestType: e.target.value }))}
                        fullWidth
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      >
                        <MenuItem value="feature">Feature</MenuItem>
                        <MenuItem value="bug">Bug</MenuItem>
                        <MenuItem value="improvement">Improvement</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Priority"
                        select
                        value={newRequest.priority}
                        onChange={(e) => setNewRequest(prev => ({ ...prev, priority: e.target.value }))}
                        fullWidth
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      >
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button onClick={() => setShowRequestForm(false)}>Cancel</Button>
                        <Button variant="contained" onClick={async () => {
                          try {
                            const requestData = {
                              requestTitle: newRequest.requestTitle,
                              description: newRequest.description,
                              requestType: newRequest.requestType,
                              priority: newRequest.priority,
                              customterList: [formData.customerDetailsObj.customerID],
                              action: {
                                status: 'pending',
                                description: 'Request created from VOC form'
                              }
                            }
                            const createdRequest = await customerRequestService.create(requestData)
                            setCustomerRequests(prev => [...prev, createdRequest])
                            setNewRequest({ requestTitle: '', description: '', requestType: 'feature', priority: 'medium' })
                            setShowRequestForm(false)
                          } catch (error) {
                            console.error('Failed to create request:', error)
                            setError('Failed to create request. Please try again.')
                          }
                        }}>Add Request</Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              ) : (
                <Grid container spacing={2}>
                  {customerRequests.length > 0 ? (
                    customerRequests.map((request) => (
                      <Grid item xs={12} sm={6} md={4} key={request._id}>
                        <RequestCard
                          request={request}
                          isSelected={formData.customerDetailsObj.customerRequestID.includes(request._id)}
                          onToggle={(id) => handleArrayChange('customerRequestID', id, !formData.customerDetailsObj.customerRequestID.includes(id))}
                          theme={theme}
                        />
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Card sx={{ textAlign: 'center', p: 4, background: `${theme.palette.action.hover}50` }}>
                        <ProjectIcon sx={{ fontSize: 48, color: theme.palette.text.disabled, mb: 1 }} />
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                          No requests available
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                          Create customer requests to link them to this VOC project
                        </Typography>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              )}
            </Grid>
          </Grid>
        )

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.info.main})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <FeedbackIcon />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Customer Feedback
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Select feedback entries to analyze
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setShowFeedbackForm(true)}
                    sx={{ borderRadius: '8px', textTransform: 'none' }}
                  >
                    Add Feedback
                  </Button>
                  <Chip
                    label={`${selectedFeedbackCount} Selected`}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.info.main})`,
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              {showFeedbackForm ? (
                <Card sx={{ p: 3, borderRadius: '12px', border: `2px solid ${theme.palette.success.main}` }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Add New Feedback</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Feedback Text"
                        value={newFeedback.feedbackText}
                        onChange={(e) => setNewFeedback(prev => ({ ...prev, feedbackText: e.target.value }))}
                        fullWidth
                        multiline
                        rows={3}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Rating"
                        select
                        value={newFeedback.rating}
                        onChange={(e) => setNewFeedback(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                        fullWidth
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      >
                        {[1,2,3,4,5].map(num => (
                          <MenuItem key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Medium"
                        select
                        value={newFeedback.medium}
                        onChange={(e) => setNewFeedback(prev => ({ ...prev, medium: e.target.value }))}
                        fullWidth
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      >
                        <MenuItem value="Email">Email</MenuItem>
                        <MenuItem value="Phone">Phone</MenuItem>
                        <MenuItem value="Survey">Survey</MenuItem>
                        <MenuItem value="Chat">Chat</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button onClick={() => setShowFeedbackForm(false)}>Cancel</Button>
                        <Button variant="contained" onClick={async () => {
                          try {
                            const feedbackData = {
                              feedbackText: newFeedback.feedbackText,
                              rating: newFeedback.rating,
                              medium: newFeedback.medium,
                              customerId: formData.customerDetailsObj.customerID,
                              feedbackType: 'general'
                            }
                            const createdFeedback = await feedbackService.create(feedbackData)
                            setFeedbacks(prev => [...prev, createdFeedback])
                            setNewFeedback({ feedbackText: '', rating: 5, medium: 'Email' })
                            setShowFeedbackForm(false)
                          } catch (error) {
                            console.error('Failed to create feedback:', error)
                            setError('Failed to create feedback. Please try again.')
                          }
                        }}>Add Feedback</Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              ) : (
                <Grid container spacing={2}>
                  {feedbacks.length > 0 ? (
                    feedbacks.map((feedback) => (
                      <Grid item xs={12} sm={6} md={4} key={feedback._id}>
                        <FeedbackCard
                          feedback={feedback}
                          isSelected={formData.customerDetailsObj.feedbackID.includes(feedback._id)}
                          onToggle={(id) => handleArrayChange('feedbackID', id, !formData.customerDetailsObj.feedbackID.includes(id))}
                          theme={theme}
                        />
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Card sx={{ textAlign: 'center', p: 4, background: `${theme.palette.action.hover}50` }}>
                        <FeedbackIcon sx={{ fontSize: 48, color: theme.palette.text.disabled, mb: 1 }} />
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                          No feedback available
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                          Collect customer feedback to link it to this VOC project
                        </Typography>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              )}
            </Grid>
          </Grid>
        )

      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <MediaIcon />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Media Upload
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Upload documents, images, or other files
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={`${uploadedFiles.length} Files`}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ p: 3, borderRadius: '12px', border: `2px dashed ${theme.palette.secondary.main}` }}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <input
                    type="file"
                    multiple
                    accept="*/*"
                    style={{ display: 'none' }}
                    id="file-upload"
                    onChange={(e) => {
                      const files = Array.from(e.target.files)
                      const newFiles = files.map(file => ({
                        id: Date.now() + Math.random(),
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        file: file
                      }))
                      setUploadedFiles(prev => [...prev, ...newFiles])
                      setFormData(prev => ({
                        ...prev,
                        mediaList: [...prev.mediaList, ...newFiles.map(f => ({ fileName: f.name, fileSize: f.size, fileType: f.type }))]
                      }))
                    }}
                  />
                  <label htmlFor="file-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 2,
                        px: 4,
                        fontSize: '1.1rem',
                        border: `2px solid ${theme.palette.secondary.main}`,
                        '&:hover': {
                          background: `${theme.palette.secondary.main}10`,
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Choose Files to Upload
                    </Button>
                  </label>
                  <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                    Drag and drop files here or click to browse
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Supports all file types • Max 10MB per file
                  </Typography>
                </Box>
              </Card>
            </Grid>

            {uploadedFiles.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Uploaded Files ({uploadedFiles.length})
                </Typography>
                <Grid container spacing={2}>
                  {uploadedFiles.map((file) => (
                    <Grid item xs={12} sm={6} md={4} key={file.id}>
                      <Card sx={{ 
                        p: 2, 
                        borderRadius: '8px',
                        border: `1px solid ${theme.palette.divider}`,
                        '&:hover': {
                          boxShadow: `0 4px 12px ${theme.palette.secondary.main}25`
                        }
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <FileIcon sx={{ color: theme.palette.secondary.main }} />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle2" sx={{ 
                              fontWeight: 600, 
                              fontSize: '0.9rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {file.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            onClick={() => {
                              setUploadedFiles(prev => prev.filter(f => f.id !== file.id))
                              setFormData(prev => ({
                                ...prev,
                                mediaList: prev.mediaList.filter(m => m.fileName !== file.name)
                              }))
                            }}
                            sx={{ minWidth: 'auto', p: 0.5 }}
                          >
                            <DeleteIcon sx={{ fontSize: 18, color: theme.palette.error.main }} />
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}
          </Grid>
        )

      case 5:
        return (
          <Grid container spacing={3}>
            {/* Stats Row */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={2.4}>
                  <StatBox
                    icon={ProjectIcon}
                    label="Requests"
                    value={selectedRequestCount}
                    color={theme.palette.error.main}
                  />
                </Grid>
                <Grid item xs={6} sm={2.4}>
                  <StatBox
                    icon={FeedbackIcon}
                    label="Feedback"
                    value={selectedFeedbackCount}
                    color={theme.palette.success.main}
                  />
                </Grid>
                <Grid item xs={6} sm={2.4}>
                  <StatBox
                    icon={MediaIcon}
                    label="Files"
                    value={uploadedFiles.length}
                    color={theme.palette.secondary.main}
                  />
                </Grid>
                <Grid item xs={6} sm={2.4}>
                  <StatBox
                    icon={CalendarIcon}
                    label="Duration"
                    value={projectDays}
                    color={theme.palette.info.main}
                  />
                </Grid>
                <Grid item xs={6} sm={2.4}>
                  <StatBox
                    icon={TrendingIcon}
                    label="Total Items"
                    value={selectedRequestCount + selectedFeedbackCount + uploadedFiles.length}
                    color={theme.palette.primary.main}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Summary Card */}
            <Grid item xs={12}>
              <Card sx={{
                background: `linear-gradient(135deg, ${theme.palette.success.main}12, ${theme.palette.primary.main}08)`,
                border: `2.5px solid ${theme.palette.primary.main}40`,
                borderRadius: '14px'
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckIcon sx={{ color: theme.palette.success.main }} />
                    Project Summary
                  </Typography>
                  <Divider sx={{ mb: 2.5 }} />
                  
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                          Project Name
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.75 }}>
                          {formData.projectName || '—'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                          Project Status
                        </Typography>
                        <Box sx={{ mt: 0.75 }}>
                          <Chip
                            label={formData.status}
                            sx={{
                              background: theme.palette[STATUS_OPTIONS.find(o => o.value === formData.status)?.color || 'default'].main,
                              color: 'white',
                              fontWeight: 700
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                          Date Range
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.75 }}>
                          {formData.vocStartDate && formData.vocEndDate
                            ? `${new Date(formData.vocStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} → ${new Date(formData.vocEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                            : '—'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>
                          Selected Customer
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.75 }}>
                          {selectedCustomer?.companyName || '—'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Linked Data */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: '14px' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FileIcon />
                    Linked Data
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ p: 2, borderRadius: '10px', background: `${theme.palette.error.main}10` }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: theme.palette.error.main }}>
                          Customer Requests
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                          {selectedRequestCount}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {formData.customerDetailsObj.customerRequestID.slice(0, 3).map((id) => {
                            const req = customerRequests.find(r => r._id === id)
                            return (
                              <Chip
                                key={id}
                                label={req?.title?.substring(0, 20) || 'Request'}
                                size="small"
                                sx={{ height: '24px', fontSize: '0.7rem' }}
                              />
                            )
                          })}
                          {selectedRequestCount > 3 && (
                            <Chip label={`+${selectedRequestCount - 3} more`} size="small" sx={{ height: '24px', fontSize: '0.7rem' }} />
                          )}
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ p: 2, borderRadius: '10px', background: `${theme.palette.success.main}10` }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: theme.palette.success.main }}>
                          Customer Feedback
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                          {selectedFeedbackCount}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {formData.customerDetailsObj.feedbackID.slice(0, 3).map((id) => {
                            const fb = feedbacks.find(f => f._id === id)
                            return (
                              <Chip
                                key={id}
                                label={`${fb?.rating || 0}★`}
                                size="small"
                                sx={{
                                  height: '24px',
                                  fontSize: '0.7rem',
                                  background: fb?.rating >= 4 ? theme.palette.success.main : theme.palette.warning.main,
                                  color: 'white'
                                }}
                              />
                            )
                          })}
                          {selectedFeedbackCount > 3 && (
                            <Chip label={`+${selectedFeedbackCount - 3} more`} size="small" sx={{ height: '24px', fontSize: '0.7rem' }} />
                          )}
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ p: 2, borderRadius: '10px', background: `${theme.palette.secondary.main}10` }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: theme.palette.secondary.main }}>
                          Media Files
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                          {uploadedFiles.length}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {uploadedFiles.slice(0, 3).map((file) => (
                            <Chip
                              key={file.id}
                              label={file.name.substring(0, 15) + (file.name.length > 15 ? '...' : '')}
                              size="small"
                              sx={{ height: '24px', fontSize: '0.7rem' }}
                            />
                          ))}
                          {uploadedFiles.length > 3 && (
                            <Chip label={`+${uploadedFiles.length - 3} more`} size="small" sx={{ height: '24px', fontSize: '0.7rem' }} />
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )

      default:
        return null
    }
  }

  if (!isOpen) return null

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return formData.projectName && formData.vocStartDate && formData.vocEndDate
      case 1:
        return formData.customerDetailsObj.customerID
      case 2:
      case 3:
      case 4:
      case 5:
        return true
      default:
        return false
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={loading}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: `0 25px 60px -12px ${theme.palette.primary.main}50`,
          background: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fafafa',
          height: '90vh',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        fontSize: '1.7rem',
        fontWeight: 800,
        pb: 2,
        background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.info.main}10)`,
        borderBottom: `2px solid ${theme.palette.divider}`,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5
      }}>
        {dialogTitle}
      </DialogTitle>

      <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
        {error && (
          <Fade in={Boolean(error)}>
            <Alert severity="error" icon={<ErrorIcon />} onClose={() => setError('')} sx={{ mb: 3, borderRadius: '12px' }}>
              {error}
            </Alert>
          </Fade>
        )}

        {success && (
          <Fade in={success}>
            <Alert severity="success" icon={<CheckIcon />} sx={{ mb: 3, borderRadius: '12px' }}>
              {isEditMode ? '✅ VOC project updated successfully!' : '✅ VOC project created successfully!'}
            </Alert>
          </Fade>
        )}

        <Stepper activeStep={activeStep} connector={<CustomStepConnector />} sx={{ mb: 4 }}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                onClick={() => setActiveStep(index)}
                sx={{ cursor: 'pointer' }}
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background:
                        index < activeStep
                          ? `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.info.main})`
                          : index === activeStep
                            ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                            : theme.palette.divider,
                      color: 'white',
                      fontWeight: 700,
                      transition: 'all 0.3s ease',
                      boxShadow: index <= activeStep
                        ? `0 0 20px ${theme.palette[index < activeStep ? 'success' : 'primary'].main}50`
                        : 'none',
                    }}
                  >
                    {index < activeStep ? <CheckIcon sx={{ fontSize: 22 }} /> : index + 1}
                  </Box>
                )}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {step.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    {step.description}
                  </Typography>
                </Box>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {dataLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Loading project data...
            </Typography>
          </Box>
        ) : (
          <Fade in={!dataLoading}>
            <Box sx={{ flex: 1 }}>
              {renderStepContent(activeStep)}
            </Box>
          </Fade>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5, gap: 1.5, borderTop: `2px solid ${theme.palette.divider}`, justifyContent: 'space-between' }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Cancel
        </Button>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
            variant="outlined"
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              border: `2px solid ${theme.palette.divider}`
            }}
          >
            ← Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !isStepValid()}
              startIcon={loading ? <CircularProgress size={18} /> : <CheckIcon />}
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
                '&:hover': {
                  boxShadow: `0 12px 32px ${theme.palette.primary.main}60`,
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {loading ? 'Saving...' : submitButtonText}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!isStepValid() || loading}
              endIcon={<ArrowIcon />}
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
                boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
                '&:hover': {
                  boxShadow: `0 12px 32px ${theme.palette.primary.main}60`,
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Next
            </Button>
          )}
        </Box>
      </DialogActions>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Dialog>
  )
}

export default VocForm