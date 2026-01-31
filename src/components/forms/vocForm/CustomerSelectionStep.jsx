import { Box, Card, CardContent, TextField, Typography, Autocomplete, Paper, Avatar, Chip, MenuItem, useTheme } from '@mui/material'
import { Lock as LockIcon, CheckCircle as CheckIcon, Error as ErrorIcon } from '@mui/icons-material'

const CUSTOMER_STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' }
]

const CustomerSelectionStep = ({ formData, setFormData, customers, loading, dataLoading, handleChange }) => {
  const theme = useTheme()
  const selectedCustomer = customers.find(c => c._id === formData.customerDetailsObj.customerID)

  return (
    <Box sx={{ p: 1, borderTop: `2px solid #ccc` }}>
      
      <Card sx={{ borderRadius: '16px', boxShadow: `0 4px 16px ${theme.palette.primary.main}08`, border: `1px solid ${theme.palette.primary.main}15` }}>
        <CardContent sx={{ p: 3 }}>
          
          <Box sx={{ width: '100%' }}>
            <Autocomplete
              options={customers}
              getOptionLabel={(option) => option.companyName || ''}
              value={customers.find(c => c._id === formData.customerDetailsObj.customerID) || null}
              onChange={(event, newValue) => {
                setFormData(prev => ({
                  ...prev,
                  customerDetailsObj: {
                    ...prev.customerDetailsObj,
                    customerID: newValue?._id || ''
                  }
                }))
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search & Select Customer"
                  placeholder="Type company name, email, or business type to search..."
                  required
                  disabled={loading || dataLoading || customers.length === 0}
                  fullWidth
                  sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: '12px',
                      fontSize: '1rem',
                      minHeight: '56px',
                      width: '100%'
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '1rem'
                    }
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props} sx={{ p: 2, minHeight: '60px', borderBottom: `1px solid ${theme.palette.divider}`, width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Avatar sx={{ 
                      width: 32, 
                      height: 32, 
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
                      fontSize: '0.875rem',
                      
                    }}>
                      {option.companyName.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.875rem', mb: 0.25 }}>
                        {option.companyName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                        {option.email || 'No email'} • {option.businessType || 'General'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      <Chip 
                        label={option.accountStatus || 'active'} 
                        size="small" 
                        color={option.accountStatus === 'active' ? 'success' : 'default'}
                        sx={{ fontSize: '0.7rem', height: '20px' }}
                      />
                      <Chip 
                        label={option.customerProficiency || 'beginner'} 
                        size="small" 
                        color={option.customerProficiency === 'advanced' ? 'success' : option.customerProficiency === 'intermediate' ? 'warning' : 'default'}
                        sx={{ fontSize: '0.7rem', height: '20px' }}
                      />
                    </Box>
                  </Box>
                </Box>
              )}
              ListboxProps={{
                sx: {
                  maxHeight: '250px',
                  width: '100%',
                  '& .MuiAutocomplete-option': {
                    minHeight: '60px',
                    width: '100%',
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}08`
                    },
                    '&.Mui-focused': {
                      backgroundColor: `${theme.palette.primary.main}12`
                    }
                  }
                }
              }}
              PaperComponent={(props) => (
                <Paper {...props} sx={{ 
                  borderRadius: '12px', 
                  boxShadow: `0 8px 20px ${theme.palette.primary.main}15`,
                  border: `1px solid ${theme.palette.divider}`,
                  mt: 1,
                  width: '100% !important',
                  minWidth: '600px'
                }} />
              )}
              filterOptions={(options, { inputValue }) => {
                return options.filter(option => 
                  option.companyName.toLowerCase().includes(inputValue.toLowerCase()) ||
                  (option.email && option.email.toLowerCase().includes(inputValue.toLowerCase())) ||
                  (option.businessType && option.businessType.toLowerCase().includes(inputValue.toLowerCase()))
                )
              }}
              noOptionsText="No customers found"
              loading={dataLoading}
              loadingText="Loading customers..."
              disablePortal
              sx={{ width: '100%' }}
            />
          </Box>

          {selectedCustomer && (
            <Card sx={{
              background: `linear-gradient(135deg, ${theme.palette.success.main}12, ${theme.palette.primary.main}08)`,
              border: `2px solid ${theme.palette.success.main}40`,
              borderRadius: '12px',
              mt: 2
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                  <Avatar sx={{ 
                    width: 40, 
                    height: 40, 
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.success.main})`,
                    fontSize: '1rem'
                  }}>
                    {selectedCustomer.companyName.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.25, fontSize: '0.95rem' }}>
                      {selectedCustomer.companyName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                      {selectedCustomer.email || 'No email'} • {selectedCustomer.businessType || 'General'}
                    </Typography>
                  </Box>
                  <Chip 
                    label="Selected" 
                    size="small" 
                    sx={{ 
                      background: theme.palette.success.main, 
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: '22px'
                    }} 
                  />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>
                    Status:
                  </Typography>
                  <TextField
                    name="customerDetailsObj.status"
                    select
                    value={formData.customerDetailsObj.status}
                    onChange={handleChange}
                    size="small"
                    sx={{ 
                      minWidth: 120,
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: '8px', 
                        background: 'white',
                        fontSize: '0.8rem'
                      },
                      '& .MuiInputBase-input': {
                        fontSize: '0.8rem'
                      }
                    }}
                  >
                    {CUSTOMER_STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default CustomerSelectionStep