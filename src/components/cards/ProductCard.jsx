import { Card, CardContent, Typography, Box, Chip, Stack, Avatar } from '@mui/material'

const ProductCard = ({ product }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success'
      case 'development': return 'warning'
      case 'deprecated': return 'error'
      case 'beta': return 'info'
      default: return 'default'
    }
  }

  return (
    <Card
      sx={{
        borderRadius: '8px',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.2s ease',
        height: 'auto',
        minHeight: '140px',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 2,
          borderColor: 'primary.main',
        }
      }}
    >
      <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack spacing={1} sx={{ height: '100%' }}>
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'secondary.main',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              {(product.name || product.productName)?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.9rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  lineHeight: 1.2,
                  mb: 0.25
                }}
              >
                {product.name || product.productName}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{
                  fontSize: '0.75rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  lineHeight: 1.2
                }}
              >
                v{product.version || '1.0'}
              </Typography>
            </Box>
          </Stack>

          {/* Description */}
          <Typography 
            variant="caption" 
            sx={{ 
              fontSize: '0.75rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              color: 'text.primary',
              flex: 1,
              lineHeight: 1.3
            }}
          >
            {product.description || 'No description available'}
          </Typography>

          {/* Tags */}
          <Stack direction="row" spacing={0.5} sx={{ mt: 'auto' }}>
            <Chip
              label={product.status || 'Active'}
              size="small"
              color={getStatusColor(product.status)}
              sx={{ fontSize: '0.7rem', height: '20px' }}
            />
            {product.releaseDate && (
              <Chip
                label={new Date(product.releaseDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: '20px' }}
              />
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ProductCard