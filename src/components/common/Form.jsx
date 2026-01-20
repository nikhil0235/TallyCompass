import { Button, TextField, Box } from '@mui/material'
import { useState } from 'react'

const Form = ({ 
  fields, 
  onSubmit, 
  loading = false, 
  submitText = 'Submit',
  loadingText = 'Submitting...' 
}) => {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <TextField
          key={field.name}
          margin="normal"
          required={field.required}
          fullWidth
          type={field.type}
          label={field.label}
          value={formData[field.name]}
          onChange={(e) => handleChange(field.name, e.target.value)}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
      ))}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{ 
          mt: 2,
          py: 1.5,
          borderRadius: 2,
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 600,
          bgcolor: '#667eea',
          '&:hover': {
            bgcolor: '#5a6fd8'
          }
        }}
      >
        {loading ? loadingText : submitText}
      </Button>
    </Box>
  )
}

export default Form