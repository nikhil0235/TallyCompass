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
  Alert,
  CircularProgress,
  Box,
  Typography,
  Divider,
  Fade
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import { closeModal } from '../../store/slices/uiSlice'
import { createProductSuccess, updateProductSuccess, productFailure } from '../../store/slices/productSlice'
import productService from '../../services/productService'

const INITIAL_FORM_STATE = {
  productName: '',
  version: '',
  releaseDate: '',
  description: '',
  category: '',
  features: ''
}

const ProductForm = () => {
  const { modals, modalData } = useSelector((state) => state.ui)
  const dispatch = useDispatch()

  const [formData, setFormData] = useState(INITIAL_FORM_STATE)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const isOpen = modals?.productForm
  const isEditMode = Boolean(modalData?._id)
  const dialogTitle = isEditMode ? 'Edit Product Information' : 'Add New Product'
  const submitButtonText = isEditMode ? 'Update Product' : 'Create Product'

  useEffect(() => {
    if (isOpen) {
      setError('')
      setSuccess(false)
      
      if (modalData && modalData._id) {
        setFormData({
          productName: modalData.productName || modalData.name || '',
          version: modalData.version || '',
          releaseDate: modalData.releaseDate ? modalData.releaseDate.split('T')[0] : '',
          description: modalData.description || '',
          category: modalData.category || '',
          features: modalData.features || ''
        })
      } else {
        setFormData(INITIAL_FORM_STATE)
      }
    }
  }, [isOpen, modalData])

  const handleClose = useCallback(() => {
    dispatch(closeModal('productForm'))
    setFormData(INITIAL_FORM_STATE)
    setError('')
    setSuccess(false)
  }, [dispatch])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    
    try {
      setError('')
      setSuccess(false)
      setLoading(true)

      let result
      if (isEditMode) {
        result = await productService.update(modalData._id, formData)
        dispatch(updateProductSuccess(result))
      } else {
        result = await productService.create(formData)
        dispatch(createProductSuccess(result))
      }
      
      setSuccess(true)
      setTimeout(() => {
        handleClose()
      }, 1500)
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred while saving'
      setError(errorMessage)
      dispatch(productFailure(errorMessage))
    } finally {
      setLoading(false)
    }
  }, [formData, isEditMode, modalData, dispatch, handleClose])

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
                {isEditMode ? 'Product updated successfully!' : 'Product created successfully!'}
              </Alert>
            </Fade>
          )}

          {/* Product Information Section */}
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
              Product Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="productName"
                  label="Product Name"
                  value={formData.productName}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={loading}
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
                  name="version"
                  label="Version"
                  value={formData.version}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={loading}
                  variant="outlined"
                  size="medium"
                  InputLabelProps={{ shrink: true }}
                  placeholder="e.g., 1.0.0"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      transition: 'all 0.2s ease'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="releaseDate"
                  label="Release Date"
                  type="date"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  fullWidth
                  disabled={loading}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={3}
                  disabled={loading}
                  variant="outlined"
                  size="medium"
                  InputLabelProps={{ shrink: true }}
                  placeholder="Enter product description..."
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

          {/* Additional Details Section */}
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
              Additional Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="category"
                  label="Category"
                  value={formData.category}
                  onChange={handleChange}
                  fullWidth
                  disabled={loading}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  placeholder="e.g., Software, Hardware"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="features"
                  label="Key Features"
                  value={formData.features}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={2}
                  disabled={loading}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  placeholder="List key features and capabilities..."
                />
              </Grid>
            </Grid>
          </Box>
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
            disabled={loading || !formData.productName.trim() || !formData.version.trim()}
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

export default ProductForm