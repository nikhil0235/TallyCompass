import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Skeleton,
  Stack,
  Container,
} from '@mui/material'
import {
  Add as AddIcon,
  Search as SearchIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  FilterList as FilterIcon,
  Phone as PhoneIcon,
  Mail as EmailIcon,
  LocationOn as LocationIcon,
  People as UsersIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Star as StarIcon,
} from '@mui/icons-material'
import Layout from '../../components/common/Layout'
import DataTable from '../../components/common/DataTable'
import { openModal, showConfirmDialog } from '../../store/slices/uiSlice'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCustomers, deleteCustomer } from '../../store/actions/customerActions'

const CustomersPage = () => {
  const { customers, loading } = useSelector((state) => state.customer)
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [viewMode, setViewMode] = useState('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [proficiencyFilter, setProficiencyFilter] = useState('all')

  useEffect(() => {
    dispatch(fetchCustomers())
  }, [dispatch])

  const handleDelete = useCallback((customer) => {
    dispatch(showConfirmDialog({
      title: 'Delete Customer',
      message: `Are you sure you want to delete ${customer.companyName}? This action cannot be undone.`,
      onConfirm: () => dispatch(deleteCustomer(customer._id))
    }))
  }, [dispatch])

  const handleEdit = useCallback((customer) => {
    dispatch(openModal({ modalName: 'customerForm', data: customer }))
  }, [dispatch])

  const handleView = useCallback((customer) => {
    dispatch(openModal({ 
      modalName: 'detailModal', 
      data: { type: 'customer', data: customer } 
    }))
  }, [dispatch])

  // Analytics
  const analytics = useMemo(() => {
    const active = customers.filter(c => c.accountStatus === 'active').length
    const inactive = customers.filter(c => c.accountStatus !== 'active').length
    const auditors = customers.filter(c => c.planType === 'Auditor').length
    const expert = customers.filter(c => c.customerProficiency === 'expert').length

    return { active, inactive, auditors, expert, total: customers.length }
  }, [customers])

  // Filtered data
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch =
        !searchTerm ||
        customer.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.contactPersonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.contactNo?.includes(searchTerm) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesPlan = planFilter === 'all' || customer.planType === planFilter
      const matchesStatus = statusFilter === 'all' || customer.accountStatus === statusFilter
      const matchesProficiency = proficiencyFilter === 'all' || customer.customerProficiency === proficiencyFilter

      return matchesSearch && matchesPlan && matchesStatus && matchesProficiency
    })
  }, [customers, searchTerm, planFilter, statusFilter, proficiencyFilter])

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <Card
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: `${color}.main`,
          boxShadow: 1,
        }
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            backgroundColor: `${color}.50`,
            color: `${color}.main`,
          }}
        >
          <Icon sx={{ fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Box>
      </Stack>
    </Card>
  )

  const CustomerGridCard = ({ customer }) => (
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
                bgcolor: 'primary.main',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              {customer.companyName?.charAt(0).toUpperCase()}
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
                {customer.companyName}
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
                {customer.businessType || 'Business'}
              </Typography>
            </Box>
          </Stack>

          {/* Contact Info */}
          <Stack spacing={0.5} sx={{ flex: 1 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                fontWeight: 500,
                fontSize: '0.75rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: 'text.primary'
              }}
            >
              {customer.contactPersonName || 'No contact'}
            </Typography>
            
            <Typography 
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: '0.7rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {customer.contactNo || customer.email || 'No contact info'}
            </Typography>
          </Stack>

          {/* Tags */}
          <Stack direction="row" spacing={0.5} sx={{ mt: 'auto' }}>
            <Chip
              label={customer.accountStatus}
              size="small"
              color={customer.accountStatus === 'active' ? 'success' : 'error'}
              sx={{ fontSize: '0.7rem', height: '20px' }}
            />
            <Chip
              label={customer.planType || 'Basic'}
              size="small"
              color={customer.planType === 'Auditor' ? 'primary' : 'default'}
              variant="outlined"
              sx={{ fontSize: '0.7rem', height: '20px' }}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Filters */}
        <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <FilterIcon color="action" />
            <Typography variant="h6">Filters</Typography>
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth>
                <InputLabel>Plan Type</InputLabel>
                <Select
                  value={planFilter}
                  label="Plan Type"
                  onChange={(e) => setPlanFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Plans</MenuItem>
                  <MenuItem value="Auditor">Auditor</MenuItem>
                  <MenuItem value="Basic">Basic</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth>
                <InputLabel>Proficiency</InputLabel>
                <Select
                  value={proficiencyFilter}
                  label="Proficiency"
                  onChange={(e) => setProficiencyFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Levels</MenuItem>
                  <MenuItem value="expert">Expert</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="beginner">Beginner</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
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
                <Tooltip title="Add Customer">
                  <IconButton
                    onClick={() => dispatch(openModal({ modalName: 'customerForm' }))}
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
          <Grid container spacing={2}>
            {[...Array(8)].map((_, i) => (
              <Grid item xs={6} sm={4} md={3} lg={2.4} key={i}>
                <Card sx={{ p: 2, borderRadius: 2 }}>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1.5}>
                      <Skeleton variant="circular" width={40} height={40} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="80%" />
                        <Skeleton variant="text" width="60%" />
                      </Box>
                    </Stack>
                    <Skeleton variant="text" count={2} />
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : filteredCustomers.length > 0 ? (
          viewMode === 'table' ? (
            <DataTable
              columns={[
                { id: 'companyName', label: 'Company', minWidth: 180 },
                { id: 'contactPersonName', label: 'Contact Person', minWidth: 150 },
                { id: 'contactNo', label: 'Contact No', minWidth: 140 },
                { id: 'businessType', label: 'Business Type', minWidth: 130 },
                {
                  id: 'planType',
                  label: 'Plan Type',
                  minWidth: 120,
                  render: (value) => (
                    <Chip
                      label={value || 'N/A'}
                      size="small"
                      color={value === 'Auditor' ? 'primary' : 'default'}
                    />
                  )
                },
                {
                  id: 'accountStatus',
                  label: 'Status',
                  minWidth: 100,
                  render: (value) => (
                    <Chip
                      label={value?.toUpperCase() || 'N/A'}
                      size="small"
                      color={value === 'active' ? 'success' : 'error'}
                    />
                  )
                },
                {
                  id: 'customerProficiency',
                  label: 'Proficiency',
                  minWidth: 120,
                  render: (value) => (
                    <Chip
                      label={value || 'N/A'}
                      size="small"
                      color={value === 'expert' ? 'success' : value === 'intermediate' ? 'warning' : 'default'}
                    />
                  )
                },
                {
                  id: 'location',
                  label: 'Location',
                  minWidth: 150,
                  render: (value) => value ? `${value.state}, ${value.country}` : '-'
                }
              ]}
              data={filteredCustomers}
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
              {filteredCustomers.map((customer) => (
                <CustomerGridCard key={customer._id} customer={customer} />
              ))}
            </Box>
          )
        ) : (
          <Card sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
            <UsersIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No customers found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your search filters or create a new customer
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => dispatch(openModal({ modalName: 'customerForm' }))}
              sx={{ borderRadius: 2 }}
            >
              Add Your First Customer
            </Button>
          </Card>
        )}
      </Container>
    </Layout>
  )
}

export default CustomersPage