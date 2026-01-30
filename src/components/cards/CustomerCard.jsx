import { Card, CardContent, Typography, Box, Chip } from '@mui/material'

const CustomerCard = ({ customer }) => {
  return (
    <Card sx={{ 
      height: 'auto', 
      minHeight: '140px',
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 2
      }
    }}>
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography 
          variant="subtitle1" 
          component="h3" 
          sx={{
            fontWeight: 600,
            fontSize: '0.95rem',
            mb: 1,
            lineHeight: 1.2,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {customer.companyName}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 0.5,
            fontSize: '0.8rem',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {customer.contactPersonName}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 1.5,
            fontSize: '0.75rem',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {customer.email}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          <Chip 
            label={customer.accountStatus} 
            color={customer.accountStatus === 'active' ? 'success' : 'default'}
            size="small"
            sx={{ fontSize: '0.7rem', height: '20px' }}
          />
          <Chip 
            label={customer.customerProficiency} 
            variant="outlined"
            size="small"
            sx={{ fontSize: '0.7rem', height: '20px' }}
          />
        </Box>
      </CardContent>
    </Card>
  )
}

export default CustomerCard