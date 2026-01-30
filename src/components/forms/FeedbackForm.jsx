import { useState, useEffect, useCallback } from 'react'
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
  Divider,
  Fade,
  Rating
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import { closeModal } from '../../store/slices/uiSlice'
import feedbackService from '../../services/feedbackService'
import customerService from '../../services/customerService'

const MEDIUM_OPTIONS = [
  { value: 'Email', label: 'Email' },
  { value: 'Phone', label: 'Phone' }
]

const INITIAL_FORM_STATE = {
  customerId: '',
  medium: 'Email',
  description: '',
  rating: 5
}

const FeedbackForm = () => {
  const { modals, modalData } = useSelector((state) => state.ui)
  const dispatch = useDispatch()

  const [formData, setFormData] = useState(INITIAL_FORM_STATE)
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const isOpen = modals?.feedbackForm
  const isEditMode = Boolean(modalData?._id)
  const dialogTitle = isEditMode ? 'Edit Feedback' : 'Add New Feedback'
  const submitButtonText = isEditMode ? 'Update Feedback' : 'Create Feedback'

  const loadCustomers = useCallback(async () => {
    try {
      setDataLoading(true)
      setError('')
      const data = await customerService.getAll()
      setCustomers(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load customers:', err)
      setError('Failed to load customers. Please try again.')
    } finally {
      setDataLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      loadCustomers()
      setError('')
      setSuccess(false)
      
      if (modalData && modalData._id) {
        setFormData({
          customerId: modalData.customerId || '',
          medium: modalData.medium || 'Email',
          description: modalData.description || '',
          rating: modalData.rating || 5
        })
      } else {
        setFormData(INITIAL_FORM_STATE)
      }
    }
  }, [isOpen, modalData, loadCustomers])

  const handleClose = useCallback(() => {
    dispatch(closeModal('feedbackForm'))
    setFormData(INITIAL_FORM_STATE)
    setError('')
    setSuccess(false)
  }, [dispatch])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleRatingChange = useCallback((event, newValue) => {
    setFormData(prev => ({ ...prev, rating: newValue }))
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    
    try {
      setError('')
      setSuccess(false)
      setLoading(true)

      let result
      if (isEditMode) {
        result = await feedbackService.update(modalData._id, formData)
      } else {
        result = await feedbackService.create(formData)
      }
      
      setSuccess(true)
      setTimeout(() => {
        handleClose()
      }, 1500)
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred while saving'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [formData, isEditMode, modalData, handleClose])

  if (!isOpen) return null

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={loading}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }
      }}
    >
      <DialogTitle
        sx={{
          fontSize: '1.5rem',
          fontWeight: 600,
          pb: 1,
          borderBottom: '1px solid #e5e7eb'
        }}
      >
        {dialogTitle}
      </DialogTitle>

      <form onSubmit={handleSubmit} noValidate>
        <DialogContent sx={{ p: 3 }}>
          {error && (
            <Fade in={Boolean(error)}>
              <Alert
                severity="error"
                icon={<ErrorIcon />}
                onClose={() => setError('')}
                sx={{ mb: 3, borderRadius: '8px' }}
              >
                {error}
              </Alert>
            </Fade>
          )}

          {success && (
            <Fade in={success}>
              <Alert
                severity="success"
                icon={<CheckCircleIcon />}
                sx={{ mb: 3, borderRadius: '8px' }}
              >
                {isEditMode ? 'Feedback updated successfully!' : 'Feedback created successfully!'}
              </Alert>
            </Fade>
          )}

          {dataLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, py: 2 }}>
              <CircularProgress size={32} />
            </Box>
          )}

          {!dataLoading && (
            <>
              {/* Feedback Information Section */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: '#374151',
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Feedback Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="customerId"
                      label="Customer"
                      select
                      value={formData.customerId}
                      onChange={handleChange}
                      fullWidth
                      required
                      disabled={loading || customers.length === 0}
                      variant="outlined"
                      size="medium"
                      InputLabelProps={{ shrink: true }}
                    >
                      {customers.map((customer) => (
                        <MenuItem key={customer._id} value={customer._id}>
                          {customer.companyName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="medium"
                      label="Medium"
                      select
                      value={formData.medium}
                      onChange={handleChange}
                      fullWidth
                      disabled={loading}
                      variant="outlined"
                      size="medium"
                      InputLabelProps={{ shrink: true }}
                    >
                      {MEDIUM_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="description"
                      label="Feedback Description"
                      value={formData.description}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={4}
                      disabled={loading}
                      variant="outlined"
                      size="medium"
                      InputLabelProps={{ shrink: true }}
                      placeholder="Enter detailed feedback..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          transition: 'all 0.2s ease'
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Rating Section */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: '#374151',
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Rating
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body1">Rating:</Typography>
                      <Rating
                        name="rating"
                        value={formData.rating}
                        onChange={handleRatingChange}
                        disabled={loading}
                        size="large"
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({formData.rating}/5)
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1
          }}
        >
          <Button
            onClick={handleClose}
            disabled={loading}
            variant="outlined"
            sx={{
              textTransform: 'none',
              fontSize: '0.95rem',
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || dataLoading || customers.length === 0 || !formData.customerId}
            startIcon={loading ? <CircularProgress size={18} /> : null}
            sx={{
              textTransform: 'none',
              fontSize: '0.95rem',
              px: 3,
              background: loading
                ? '#9ca3af'
                : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              '&:hover': {
                background: !loading ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : undefined
              }
            }}
          >
            {loading ? 'Saving...' : submitButtonText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default FeedbackForm