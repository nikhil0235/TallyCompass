import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  LinearProgress,
  Pagination,
  useTheme,
  useMediaQuery,
  Alert,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  AvatarGroup,
  Avatar,
} from '@mui/material'
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon,
  Message as MessageIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  CalendarToday as CalendarIcon,
  MoreVert as MoreIcon,
  CheckCircle as CheckIcon,
  Error as AlertIcon,
} from '@mui/icons-material'
import Layout from '../../components/common/Layout'
import FeedbackCard from '../../components/cards/FeedbackCard'
import { openModal, showConfirmDialog } from '../../store/slices/uiSlice'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import feedbackService from '../../services/feedbackService'

const ITEMS_PER_PAGE = 10


const FeedbackPage = () => {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [mediumFilter, setMediumFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [openDetails, setOpenDetails] = useState(false)
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      // Load single feedback by id
      loadFeedbackById(id);
    } else {
      loadFeedback();
    }
    // eslint-disable-next-line
  }, [id]);

  const loadFeedback = async () => {
    try {
      setLoading(true)
      const data = await feedbackService.getAll()
      setFeedback(data)
    } catch (error) {
      console.error('Error loading feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFeedbackById = async (feedbackId) => {
    try {
      setLoading(true)
      const data = await feedbackService.getById(feedbackId)
      setFeedback(data ? [data] : [])
    } catch (error) {
      setFeedback([])
      console.error('Error loading feedback by id:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (item) => {
    dispatch(
      showConfirmDialog({
        title: 'Delete Feedback',
        message: 'Are you sure you want to delete this feedback? This action cannot be undone.',
        onConfirm: () => deleteFeedback(item._id),
      })
    )
  }

  const deleteFeedback = async (id) => {
    try {
      await feedbackService.delete(id)
      setFeedback((prev) => prev.filter((item) => item._id !== id))
    } catch (error) {
      console.error('Error deleting feedback:', error)
    }
  }

  const handleEdit = (item) => {
    dispatch(openModal({ modalName: 'feedbackForm', data: item }))
  }

  const handleView = (item) => {
    setSelectedFeedback(item)
    setOpenDetails(true)
  }

  const filteredFeedback = useMemo(() => {
    return feedback.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customerId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesMedium = mediumFilter === 'all' || item.medium === mediumFilter
      const matchesRating = ratingFilter === 'all' || item.rating?.toString() === ratingFilter

      return matchesSearch && matchesMedium && matchesRating
    })
  }, [feedback, searchTerm, mediumFilter, ratingFilter])

  const paginatedFeedback = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredFeedback.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredFeedback, currentPage])

  const totalPages = Math.ceil(filteredFeedback.length / ITEMS_PER_PAGE)

  // Analytics
  const avgRating = feedback.length > 0 ? (feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.length).toFixed(1) : 0
  const totalFeedback = feedback.length
  const emailFeedback = feedback.filter((f) => f.medium === 'Email').length
  const phoneFeedback = feedback.filter((f) => f.medium === 'Phone').length
  const highRatings = feedback.filter((f) => f.rating >= 4).length
  const ratingDistribution = {
    5: feedback.filter((f) => f.rating === 5).length,
    4: feedback.filter((f) => f.rating === 4).length,
    3: feedback.filter((f) => f.rating === 3).length,
    2: feedback.filter((f) => f.rating === 2).length,
    1: feedback.filter((f) => f.rating === 1).length,
  }

  const LoadingSkeleton = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {[...Array(5)].map((_, i) => (
        <Card key={i} sx={{ borderRadius: '12px' }}>
          <CardContent>
            <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
            <Skeleton variant="text" count={2} />
          </CardContent>
        </Card>
      ))}
    </Box>
  )



  const RatingStars = ({ rating }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Rating value={rating} readOnly size="small" />
      <Typography variant="caption" sx={{ fontWeight: 600, ml: 0.5 }}>
        {rating}/5
      </Typography>
    </Box>
  )

  return (
    <Layout>
      <Box sx={{ pb: 8 }}>
        {/* Filters Section */}
        <Card sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <SearchIcon color="action" />
            <Typography variant="h6">Filters & Insights</Typography>
          </Stack>
          
          {/* Stats Row */}
          <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
            <Chip 
              label={`Total: ${totalFeedback}`}
              color="primary"
              size="small"
              variant="outlined"
            />
            <Chip 
              label={`Avg: ${avgRating}/5`}
              color="warning"
              size="small"
              variant="outlined"
            />
            <Chip 
              label={`Positive: ${highRatings}`}
              color="success"
              size="small"
              variant="outlined"
            />
            <Chip 
              label={`Email: ${emailFeedback}`}
              color="info"
              size="small"
              variant="outlined"
            />
            <Chip 
              label={`Phone: ${phoneFeedback}`}
              color="success"
              size="small"
              variant="outlined"
            />
            {/* Rating Distribution */}
            {[5, 4, 3, 2, 1].map((star) => (
              <Chip
                key={star}
                label={`${star}★ ${ratingDistribution[star]}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            ))}
          </Stack>

          <Grid container spacing={2} alignItems="flex-end">
            <Grid>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by customer name or feedback..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid>
              <FormControl fullWidth size="small">
                <InputLabel>Medium</InputLabel>
                <Select
                  value={mediumFilter}
                  label="Medium"
                  onChange={(e) => {
                    setMediumFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="all">All Mediums</MenuItem>
                  <MenuItem value="Email">Email</MenuItem>
                  <MenuItem value="Phone">Phone</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <FormControl fullWidth size="small">
                <InputLabel>Rating</InputLabel>
                <Select
                  value={ratingFilter}
                  label="Rating"
                  onChange={(e) => {
                    setRatingFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="all">All Ratings</MenuItem>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <MenuItem key={rating} value={rating.toString()}>
                      {rating} Star{rating !== 1 ? 's' : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              {(searchTerm || mediumFilter !== 'all' || ratingFilter !== 'all') && (
                <Button
                  fullWidth
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setSearchTerm('')
                    setMediumFilter('all')
                    setRatingFilter('all')
                    setCurrentPage(1)
                  }}
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Clear
                </Button>
              )}
            </Grid>
          </Grid>
        </Card>

        {/* Feedback List */}
        {loading ? (
          <LoadingSkeleton />
        ) : filteredFeedback.length > 0 ? (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 3,
                mb: 4,
              }}
            >
              {paginatedFeedback.map((item) => (
                <Box key={item._id} sx={{ animation: 'fadeIn 0.3s ease', height: 'fit-content' }}>
                  <FeedbackCard feedback={item} />
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
            <MessageIcon sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              No feedback found
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Start collecting customer feedback to build a better product
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => dispatch(openModal({ modalName: 'feedbackForm' }))}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Add Your First Feedback
            </Button>
          </Card>
        )}
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

      {/* Details Modal */}
      <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.3rem' }}>
          Feedback Details
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 2 }}>
          {selectedFeedback && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Customer
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>
                  {selectedFeedback.customerId?.name || 'Anonymous'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Rating
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <RatingStars rating={selectedFeedback.rating || 0} />
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Medium
                </Typography>
                <Chip
                  icon={selectedFeedback.medium === 'Email' ? <MailIcon /> : <PhoneIcon />}
                  label={selectedFeedback.medium || 'Unknown'}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Feedback
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                    p: 2,
                    backgroundColor: theme.palette.action.hover,
                    borderRadius: '8px',
                    lineHeight: 1.6,
                  }}
                >
                  {selectedFeedback.description || 'No description provided'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Date
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                  {new Date(selectedFeedback.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDetails(false)}>Close</Button>
          {selectedFeedback && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => {
                handleEdit(selectedFeedback)
                setOpenDetails(false)
              }}
            >
              Edit
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Layout>
  )
}

export default FeedbackPage