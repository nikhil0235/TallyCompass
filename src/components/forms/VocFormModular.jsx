import { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Fade,
  styled,
  useTheme
} from '@mui/material'
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Assignment as ProjectIcon,
  Person as CustomerIcon,
  Feedback as FeedbackIcon,
  AttachFile as MediaIcon,
  ArrowRight as ArrowIcon,
  BuildCircle as BuildIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import { closeModal } from '../../store/slices/uiSlice'
import { createVocSuccess, updateVocSuccess, vocFailure } from '../../store/slices/vocSlice'
import vocService from '../../services/vocService'
import customerService from '../../services/customerService'
import feedbackService from '../../services/feedbackService'
import customerRequestService from '../../services/customerRequestService'

// Import step components
import ProjectDetailsStep from './vocForm/ProjectDetailsStep'
import CustomerSelectionStep from './vocForm/CustomerSelectionStep'
import RequestsStep from './vocForm/RequestsStep'
import FeedbackStep from './vocForm/FeedbackStep'
import MediaUploadStep from './vocForm/MediaUploadStep'
import ReviewStep from './vocForm/ReviewStep'

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
  { label: 'Project Details', icon: <BuildIcon />, color: 'info' },
  { label: 'Customer', icon: <CustomerIcon />, color: 'warning' },
  { label: 'Requests', icon: <ProjectIcon />, color: 'error' },
  { label: 'Feedback', icon: <FeedbackIcon />, color: 'success' },
  { label: 'Media', icon: <MediaIcon />, color: 'secondary' },
  { label: 'Review', icon: <CheckIcon />, color: 'primary' }
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
  const dialogTitle = isEditMode ? 'Edit VOC' : 'Create New VOC'
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
          <ProjectDetailsStep
            formData={formData}
            handleChange={handleChange}
            loading={loading}
          />
        )
      case 1:
        return (
          <CustomerSelectionStep
            formData={formData}
            setFormData={setFormData}
            customers={customers}
            loading={loading}
            dataLoading={dataLoading}
            handleChange={handleChange}
          />
        )
      case 2:
        return (
          <RequestsStep
            formData={formData}
            customerRequests={customerRequests}
            selectedRequestCount={selectedRequestCount}
            showRequestForm={showRequestForm}
            setShowRequestForm={setShowRequestForm}
            newRequest={newRequest}
            setNewRequest={setNewRequest}
            handleArrayChange={handleArrayChange}
            setCustomerRequests={setCustomerRequests}
            setError={setError}
            customerRequestService={customerRequestService}
            theme={theme}
            setFormData={setFormData}
          />
        )
      case 3:
        return (
          <FeedbackStep
            formData={formData}
            feedbacks={feedbacks}
            selectedFeedbackCount={selectedFeedbackCount}
            showFeedbackForm={showFeedbackForm}
            setShowFeedbackForm={setShowFeedbackForm}
            newFeedback={newFeedback}
            setNewFeedback={setNewFeedback}
            handleArrayChange={handleArrayChange}
            setFeedbacks={setFeedbacks}
            setError={setError}
            feedbackService={feedbackService}
            theme={theme}
          />
        )
      case 4:
        return (
          <MediaUploadStep
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            setFormData={setFormData}
            theme={theme}
          />
        )
      case 5:
        return (
          <ReviewStep
            formData={formData}
            selectedCustomer={selectedCustomer}
            selectedRequestCount={selectedRequestCount}
            selectedFeedbackCount={selectedFeedbackCount}
            uploadedFiles={uploadedFiles}
            projectDays={projectDays}
            customerRequests={customerRequests}
            feedbacks={feedbacks}
            theme={theme}
          />
        )
      default:
        return null
    }
  }

  if (!isOpen) return null

  const isStepValid = () => {
    return true
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
        pt: 3,
        pb: 2,
        background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.info.main}10)`,
        borderTop: `1px solid ${theme.palette.divider}`,
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5
      }}>
        {dialogTitle}
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            minWidth: 'auto',
            width: 40,
            height: 40,
            borderRadius: '50%',
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'action.hover',
              color: 'text.primary'
            }
          }}
        >
          <CloseIcon />
        </Button>
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

        <Stepper activeStep={activeStep} connector={null} sx={{ mb: 4 }}>
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
                      mt: '10px',
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

      <DialogActions sx={{ p: 2.5, gap: 1.5, borderTop: `2px solid ${theme.palette.divider}`, justifyContent: 'flex-end' }}>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
            variant="outlined"
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Back
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
    </Dialog>
  )
}

export default VocForm