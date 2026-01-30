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
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Divider,
  Typography,
  Chip,
  Fade
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import { closeModal } from '../../store/slices/uiSlice'
import { createCustomerSuccess, updateCustomerSuccess, customerFailure } from '../../store/slices/customerSlice'
import customerService from '../../services/customerService'
import productService from '../../services/productService'

const ACCOUNT_STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'inactive', label: 'Inactive', color: 'default' }
]

const PROFICIENCY_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
]

const INITIAL_FORM_STATE = {
  companyName: '',
  contactPersonName: '',
  email: '',
  contactNo: '',
  businessType: '',
  planType: '',
  accountStatus: 'active',
  customerProficiency: 'beginner',
  currentProductID: '',
  location: {
    country: '',
    state: '',
    city: '',
    pincode: ''
  }
}

const CustomerForm = () => {
  const { modals, modalData } = useSelector((state) => state.ui)
  const dispatch = useDispatch()

  // State
  const [formData, setFormData] = useState(INITIAL_FORM_STATE)
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Computed values
  const isOpen = modals?.customerForm
  const isEditMode = Boolean(modalData?._id)
  const dialogTitle = isEditMode ? 'Edit Customer Information' : 'Add New Customer'
  const submitButtonText = isEditMode ? 'Update Customer' : 'Create Customer'

  // Load products
  const loadProducts = useCallback(async () => {
    try {
      setProductsLoading(true)
      setError('')
      const data = await productService.getAll()
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load products:', err)
      setError('Failed to load products. Please try again.')
      setProducts([])
    } finally {
      setProductsLoading(false)
    }
  }, [])

  // Initialize form with modal data
  useEffect(() => {
    if (isOpen) {
      loadProducts()
      setError('')
      setSuccess(false)

      if (modalData && modalData._id) {
        setFormData({
          companyName: modalData.companyName || '',
          contactPersonName: modalData.contactPersonName || '',
          email: modalData.email || '',
          contactNo: modalData.contactNo || '',
          businessType: modalData.businessType || '',
          planType: modalData.planType || '',
          accountStatus: modalData.accountStatus || 'active',
          customerProficiency: modalData.customerProficiency || 'beginner',
          currentProductID: modalData.currentProductID || '',
          location: {
            country: modalData.location?.country || '',
            state: modalData.location?.state || '',
            city: modalData.location?.city || '',
            pincode: modalData.location?.pincode || ''
          }
        })
      } else {
        setFormData(INITIAL_FORM_STATE)
      }
    }
  }, [isOpen, modalData, loadProducts])

  // Handlers
  const handleClose = useCallback(() => {
    dispatch(closeModal('customerForm'))
    setFormData(INITIAL_FORM_STATE)
    setError('')
    setSuccess(false)
  }, [dispatch])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [locationField]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    
    try {
      setError('')
      setSuccess(false)
      setLoading(true)

      let result
      if (isEditMode) {
        result = await customerService.update(modalData._id, formData)
        dispatch(updateCustomerSuccess(result))
      } else {
        result = await customerService.create(formData)
        dispatch(createCustomerSuccess(result))
      }

      setSuccess(true)
      setTimeout(() => {
        handleClose()
      }, 1500)
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred while saving'
      setError(errorMessage)
      dispatch(customerFailure(errorMessage))
    } finally {
      setLoading(false)
    }
  }, [formData, isEditMode, modalData, dispatch, handleClose])

  // Memoized options
  const productOptions = useMemo(
    () =>
      products.map((product) => (
        <MenuItem key={product._id} value={product._id}>
          {product.name || product.productName || 'Unnamed Product'}
        </MenuItem>
      )),
    [products]
  )

  const accountStatusOptions = useMemo(
    () =>
      ACCOUNT_STATUS_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          <Chip label={option.label} size="small" variant="outlined" />
        </MenuItem>
      )),
    []
  )

  const proficiencyOptions = useMemo(
    () =>
      PROFICIENCY_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      )),
    []
  )

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
                {isEditMode ? 'Customer updated successfully!' : 'Customer created successfully!'}
              </Alert>
            </Fade>
          )}

          {productsLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, py: 2 }}>
              <CircularProgress size={32} />
            </Box>
          )}

          {!productsLoading && (
            <>
              {/* Company Information Section */}
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
                  Company Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="companyName"
                      label="Company Name"
                      value={formData.companyName}
                      onChange={handleChange}
                      fullWidth
                      required
                      disabled={loading || productsLoading}
                      variant="outlined"
                      size="medium"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          transition: 'all 0.2s ease'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="contactPersonName"
                      label="Contact Person"
                      value={formData.contactPersonName}
                      onChange={handleChange}
                      fullWidth
                      disabled={loading || productsLoading}
                      variant="outlined"
                      size="medium"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          transition: 'all 0.2s ease'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="email"
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      fullWidth
                      required
                      disabled={loading || productsLoading}
                      variant="outlined"
                      size="medium"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          transition: 'all 0.2s ease'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="contactNo"
                      label="Contact Number"
                      type="tel"
                      value={formData.contactNo}
                      onChange={handleChange}
                      fullWidth
                      required
                      disabled={loading || productsLoading}
                      helperText="Include country code (e.g., +91-XXXXXXXXXX)"
                      variant="outlined"
                      size="medium"
                      InputLabelProps={{ shrink: true }}
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

              {/* Business Details Section */}
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
                  Business Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="businessType"
                      label="Business Type"
                      value={formData.businessType}
                      onChange={handleChange}
                      fullWidth
                      disabled={loading || productsLoading}
                      variant="outlined"
                      size="medium"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          transition: 'all 0.2s ease'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="planType"
                      label="Plan Type"
                      value={formData.planType}
                      onChange={handleChange}
                      fullWidth
                      disabled={loading || productsLoading}
                      variant="outlined"
                      size="medium"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          transition: 'all 0.2s ease'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth disabled={loading}>
                      <InputLabel>Account Status</InputLabel>
                      <Select
                        name="accountStatus"
                        value={formData.accountStatus}
                        onChange={handleChange}
                        label="Account Status"
                      >
                        {accountStatusOptions}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth disabled={loading}>
                      <InputLabel>Proficiency Level</InputLabel>
                      <Select
                        name="customerProficiency"
                        value={formData.customerProficiency}
                        onChange={handleChange}
                        label="Proficiency Level"
                      >
                        {proficiencyOptions}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl
                      fullWidth
                      disabled={loading || productsLoading || products.length === 0}
                    >
                      <InputLabel>Product</InputLabel>
                      <Select
                        name="currentProductID"
                        value={formData.currentProductID}
                        onChange={handleChange}
                        label="Product"
                      >
                        {productOptions}
                      </Select>
                      {products.length === 0 && (
                        <FormHelperText error>
                          No products available. Please create a product first.
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Location Section */}
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
                  Location Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="location.country"
                      label="Country"
                      value={formData.location.country}
                      onChange={handleChange}
                      fullWidth
                      disabled={loading}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="location.state"
                      label="State/Province"
                      value={formData.location.state}
                      onChange={handleChange}
                      fullWidth
                      disabled={loading}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="location.city"
                      label="City"
                      value={formData.location.city}
                      onChange={handleChange}
                      fullWidth
                      disabled={loading}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="location.pincode"
                      label="Postal Code"
                      value={formData.location.pincode}
                      onChange={handleChange}
                      fullWidth
                      disabled={loading}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
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
            disabled={loading || productsLoading || products.length === 0}
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

export default CustomerForm