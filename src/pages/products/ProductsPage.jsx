import { useState, useEffect, useMemo } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Stack,
  Container,
  Grid,
  Chip,
  Skeleton
} from '@mui/material'
import {
  Add as AddIcon,
  Search as SearchIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  FilterList as FilterIcon,
  Inventory as ProductsIcon
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import Layout from '../../components/common/Layout'
import DataTable from '../../components/common/DataTable'
import ProductCard from '../../components/cards/ProductCard'
import { openModal, showConfirmDialog } from '../../store/slices/uiSlice'
import { productStart, getProductsSuccess, deleteProductSuccess, productFailure } from '../../store/slices/productSlice'
import productService from '../../services/productService'

const ProductsPage = () => {
  const { products, loading } = useSelector((state) => state.product)
  const dispatch = useDispatch()
  const [viewMode, setViewMode] = useState('cards')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [versionFilter, setVersionFilter] = useState('all')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      dispatch(productStart())
      const data = await productService.getAll()
      dispatch(getProductsSuccess(data))
    } catch (error) {
      dispatch(productFailure(error.message))
    }
  }

  const handleDelete = (product) => {
    dispatch(showConfirmDialog({
      title: 'Delete Product',
      message: `Are you sure you want to delete ${product.name || product.productName}?`,
      onConfirm: () => deleteProduct(product._id)
    }))
  }

  const deleteProduct = async (id) => {
    try {
      await productService.delete(id)
      dispatch(deleteProductSuccess(id))
    } catch (error) {
      dispatch(productFailure(error.message))
    }
  }

  const handleEdit = (product) => {
    dispatch(openModal({ modalName: 'productForm', data: product }))
  }

  const handleView = (product) => {
    dispatch(openModal({ 
      modalName: 'detailModal', 
      data: { type: 'product', data: product } 
    }))
  }

  // Filtered data
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch =
        !searchTerm ||
        (product.name || product.productName)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.version?.includes(searchTerm)

      const matchesStatus = statusFilter === 'all' || product.status === statusFilter
      const matchesVersion = versionFilter === 'all' || product.version?.startsWith(versionFilter)

      return matchesSearch && matchesStatus && matchesVersion
    })
  }, [products, searchTerm, statusFilter, versionFilter])

  // Analytics
  const analytics = useMemo(() => {
    const active = products.filter(p => p.status === 'active').length
    const development = products.filter(p => p.status === 'development').length
    const beta = products.filter(p => p.status === 'beta').length
    const deprecated = products.filter(p => p.status === 'deprecated').length

    return { active, development, beta, deprecated, total: products.length }
  }, [products])

  const columns = [
    { id: 'name', label: 'Product Name', render: (value, row) => value || row.productName },
    { id: 'description', label: 'Description' },
    { id: 'version', label: 'Version', render: (value) => value || 'N/A' },
    { 
      id: 'status', 
      label: 'Status',
      render: (value) => (
        <Chip
          label={value || 'Active'}
          size="small"
          color={value === 'active' ? 'success' : value === 'development' ? 'warning' : value === 'beta' ? 'info' : 'default'}
        />
      )
    },
    {id:'releaseDate', label:'Release Date', render:(value) => value ? new Date(value).toLocaleDateString() : 'N/A' }
  ]

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Filters */}
        <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <FilterIcon color="action" />
            <Typography variant="h6">Filters & Insights</Typography>
          </Stack>
          
          {/* Stats Row */}
          <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
            <Chip 
              label={`Total: ${analytics.total}`}
              color="primary"
              size="small"
              variant="outlined"
            />
            <Chip 
              label={`Active: ${analytics.active}`}
              color="success"
              size="small"
              variant="outlined"
            />
            <Chip 
              label={`Development: ${analytics.development}`}
              color="warning"
              size="small"
              variant="outlined"
            />
            <Chip 
              label={`Beta: ${analytics.beta}`}
              color="info"
              size="small"
              variant="outlined"
            />
            <Chip 
              label={`Deprecated: ${analytics.deprecated}`}
              color="error"
              size="small"
              variant="outlined"
            />
          </Stack>

          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={6} md={5}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="development">Development</MenuItem>
                  <MenuItem value="beta">Beta</MenuItem>
                  <MenuItem value="deprecated">Deprecated</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <FormControl fullWidth size="small">
                <InputLabel>Version</InputLabel>
                <Select
                  value={versionFilter}
                  label="Version"
                  onChange={(e) => setVersionFilter(e.target.value)}
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="all">All Versions</MenuItem>
                  <MenuItem value="1">v1.x</MenuItem>
                  <MenuItem value="2">v2.x</MenuItem>
                  <MenuItem value="3">v3.x</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Tooltip title="Table View">
                  <IconButton
                    onClick={() => setViewMode('table')}
                    color={viewMode === 'table' ? 'primary' : 'default'}
                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
                  >
                    <ListViewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Grid View">
                  <IconButton
                    onClick={() => setViewMode('cards')}
                    color={viewMode === 'cards' ? 'primary' : 'default'}
                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
                  >
                    <GridViewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Add Product">
                  <IconButton
                    onClick={() => dispatch(openModal({ modalName: 'productForm' }))}
                    color="primary"
                    sx={{ 
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark'
                      }
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid>
          </Grid>
        </Card>

        {/* Content */}
        {loading ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 2,
            }}
          >
            {[...Array(6)].map((_, i) => (
              <Card key={i} sx={{ p: 2, borderRadius: 2 }}>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1}>
                    <Skeleton variant="circular" width={32} height={32} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="60%" />
                    </Box>
                  </Stack>
                  <Skeleton variant="text" count={2} />
                  <Skeleton variant="rectangular" height={20} width={60} />
                </Stack>
              </Card>
            ))}
          </Box>
        ) : filteredProducts.length > 0 ? (
          viewMode === 'table' ? (
            <DataTable
              columns={columns}
              data={filteredProducts}
              loading={false}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 2,
              }}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </Box>
          )
        ) : (
          <Card sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
            <ProductsIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No products found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your search filters or create a new product
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => dispatch(openModal({ modalName: 'productForm' }))}
              sx={{ borderRadius: 2 }}
            >
              Add Your First Product
            </Button>
          </Card>
        )}
      </Container>
    </Layout>
  )
}

export default ProductsPage