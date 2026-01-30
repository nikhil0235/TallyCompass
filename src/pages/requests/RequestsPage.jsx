import { useState, useEffect, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  Skeleton,
  Pagination,
  Card,
  CardContent,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  Avatar,
  LinearProgress,
  Slider,
} from '@mui/material'
import {
  BugReport as IssueIcon,
  LightbulbOutlined as FeatureIcon,
  Search as SearchIcon,
  TrendingUp as TrendingIcon,
  CheckCircle as ResolvedIcon,
  AccessTime as PendingIcon,
  Person as CustomerIcon,
  Assignment as RequestIcon,
} from '@mui/icons-material'
import Layout from '../../components/common/Layout'
import RequestCard from '../../components/cards/RequestCard'
import { fetchRequests, updateRequestStatus } from '../../store/actions/requestActions'
import { notify } from '../../utils/notify'

const ITEMS_PER_PAGE = 12

const RequestsPage = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [customerCountFilter, setCustomerCountFilter] = useState([0, 10])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageError, setPageError] = useState(null)
  
  const dispatch = useDispatch()
  const { requests = [], loading = false, error } = useSelector((state) => state.requests || {})
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    try {
      dispatch(fetchRequests())
    } catch (err) {
      console.error('Error dispatching fetchRequests:', err)
      setPageError('Failed to load requests')
    }
  }, [dispatch])

  const handleTabChange = useCallback((event, newValue) => {
    setActiveTab(newValue)
    setCurrentPage(1)
  }, [])

  const handleStatusUpdate = useCallback(
    async (requestId, currentStatus) => {
      const nextStatus =
        currentStatus === 'open'
          ? 'in-progress'
          : currentStatus === 'in-progress'
            ? 'resolved'
            : 'open'
      try {
        await dispatch(updateRequestStatus(requestId, nextStatus))
        notify.success('Status updated successfully')
      } catch (error) {
        notify.error('Failed to update status')
      }
    },
    [dispatch]
  )

  const getStatusColor = useCallback((status) => {
    const colors = {
      open: 'primary',
      'in-progress': 'warning',
      resolved: 'success',
      closed: 'default',
    }
    return colors[status?.toLowerCase()] || 'default'
  }, [])

  const getPriorityColor = useCallback((priority) => {
    const colors = {
      high: 'error',
      medium: 'warning',
      low: 'success',
    }
    return colors[priority?.toLowerCase()] || 'default'
  }, [])

  const filteredRequests = useMemo(() => {
    try {
      if (!Array.isArray(requests)) {
        console.warn('Requests is not an array:', requests)
        return []
      }
      return requests.filter((request) => {
        if (!request) return false
        const matchesTab =
          activeTab === 0 ? request.type === 'feature' : request.type === 'issue'
        const matchesSearch =
          !searchTerm ||
          (request.title && request.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (request.description && request.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (request.customerName && request.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter
        const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter
        const matchesCustomerCount = Array.isArray(request.customerList) 
          ? request.customerList.length >= customerCountFilter[0] && request.customerList.length <= customerCountFilter[1]
          : customerCountFilter[0] === 0
        return matchesTab && matchesSearch && matchesStatus && matchesPriority && matchesCustomerCount
      })
    } catch (error) {
      console.error('Error filtering requests:', error)
      return []
    }
  }, [requests, activeTab, searchTerm, statusFilter, priorityFilter, customerCountFilter])

  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredRequests, currentPage])

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE)

  // Calculate stats
  const featureCount = Array.isArray(requests) ? requests.filter((r) => r && r.type === 'feature').length : 0
  const issueCount = Array.isArray(requests) ? requests.filter((r) => r && r.type === 'issue').length : 0
  const resolvedCount = Array.isArray(requests) ? requests.filter((r) => r && r.status === 'resolved').length : 0
  const inProgressCount = Array.isArray(requests) ? requests.filter((r) => r && r.status === 'in-progress').length : 0

  const LoadingSkeleton = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 3 }}>
      {[...Array(6)].map((_, index) => (
        <Card key={index} sx={{ height: 280, borderRadius: '12px' }}>
          <CardContent>
            <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="text" count={3} />
            <Skeleton variant="rectangular" height={30} sx={{ mt: 2 }} />
          </CardContent>
        </Card>
      ))}
    </Box>
  )

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <Card
      sx={{
        flex: 1,
        minWidth: '140px',
        background: `linear-gradient(135deg, ${theme.palette[color].light}15, ${theme.palette[color].main}08)`,
        border: `2px solid ${theme.palette[color].light}`,
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${theme.palette[color].main}20`,
        },
      }}
    >
      <CardContent sx={{ textAlign: 'center', p: 2 }}>
        <Icon
          sx={{
            fontSize: 28,
            color: theme.palette[color].main,
            mb: 1,
          }}
        />
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          {label}
        </Typography>
      </CardContent>
    </Card>
  )

  return (
    <Layout>
      <Box sx={{ pb: 8 }}>
        {/* Error Alert */}
        {(error || pageError) && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: '12px',
              border: `2px solid ${theme.palette.error.light}`,
              background: `${theme.palette.error.light}10`,
            }}
          >
            {error || pageError}
          </Alert>
        )}



        {/* Tabs with Stats Combined */}
        <Card
          sx={{
            mb: 3,
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    fontWeight: 600,
                    textTransform: 'none',
                    minHeight: 40,
                    px: 2,
                  },
                }}
              >
                <Tab
                  icon={<FeatureIcon sx={{ fontSize: 18 }} />}
                  label={`Features (${featureCount})`}
                  iconPosition="start"
                />
                <Tab
                  icon={<IssueIcon sx={{ fontSize: 18 }} />}
                  label={`Issues (${issueCount})`}
                  iconPosition="start"
                />
              </Tabs>
              
              <Stack direction="row" spacing={2}>
                <Chip 
                  icon={<PendingIcon sx={{ fontSize: 16 }} />}
                  label={`Review: ${requests.filter(r => r.status === 'review').length}`}
                  color="warning"
                  size="small"
                  variant="outlined"
                />
                <Chip 
                  icon={<ResolvedIcon sx={{ fontSize: 16 }} />}
                  label={`Resolved: ${resolvedCount}`}
                  color="success"
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </Box>
          </Box>
        </Card>

        {/* Compact Filters */}
        <Card sx={{ mb: 3, borderRadius: '12px' }}>
          <CardContent sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select 
                    value={statusFilter} 
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="review">Review</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Priority</InputLabel>
                  <Select 
                    value={priorityFilter} 
                    label="Priority"
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={8} md={2}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    Customers: {customerCountFilter[0]}-{customerCountFilter[1]}
                  </Typography>
                  <Slider
                    value={customerCountFilter}
                    onChange={(e, newValue) => setCustomerCountFilter(newValue)}
                    min={0}
                    max={20}
                    size="small"
                    sx={{ '& .MuiSlider-thumb': { width: 16, height: 16 } }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={4} md={1}>
                {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || customerCountFilter[0] !== 0 || customerCountFilter[1] !== 10) && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setSearchTerm('')
                      setStatusFilter('all')
                      setPriorityFilter('all')
                      setCustomerCountFilter([0, 10])
                      setCurrentPage(1)
                    }}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      minWidth: 'auto',
                      px: 2
                    }}
                  >
                    Clear
                  </Button>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Box>
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {filteredRequests.length > 0 ? (
                <>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                      gap: 3,
                      mb: 4,
                    }}
                  >
                    {paginatedRequests.map((request) => (
                      <Box key={request.id} sx={{ animation: 'fadeIn 0.3s ease', height: 'fit-content' }}>
                        <RequestCard
                          request={request}
                          onStatusUpdate={handleStatusUpdate}
                          statusColor={getStatusColor(request.status)}
                          priorityColor={getPriorityColor(request.priority)}
                        />
                      </Box>
                    ))}
                  </Box>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(event, page) => setCurrentPage(page)}
                        color="primary"
                        size={isMobile ? 'small' : 'medium'}
                        sx={{
                          '& .MuiPaginationItem-root': {
                            borderRadius: '8px',
                            fontWeight: 600,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                            },
                          },
                        }}
                      />
                    </Box>
                  )}
                </>
              ) : (
                <Card
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${theme.palette.action.hover}50, transparent)`,
                    border: `2px dashed ${theme.palette.divider}`,
                  }}
                >
                  <Box sx={{ mb: 2, opacity: 0.6 }}>
                    {activeTab === 0 ? (
                      <FeatureIcon sx={{ fontSize: 64, mb: 1 }} />
                    ) : (
                      <IssueIcon sx={{ fontSize: 64, mb: 1 }} />
                    )}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    No {activeTab === 0 ? 'feature requests' : 'issues'} found
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Try adjusting your search or filters to find what you're looking for
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSearchTerm('')
                      setStatusFilter('all')
                      setPriorityFilter('all')
                      setCustomerCountFilter([0, 10])
                      setCurrentPage(1)
                    }}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Reset Filters
                  </Button>
                </Card>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Global Styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Layout>
  )
}

export default RequestsPage