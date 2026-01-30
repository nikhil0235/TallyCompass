import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Box,
  Button,
  Typography,
  Grid,
  Chip,
  Tabs,
  Tab,
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
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  Add,
  Search as SearchIcon,
  Business as BusinessIcon,
  Assignment as ProjectIcon,
  CheckCircle as CompletedIcon,
  Schedule as OngoingIcon,
  PlayArrow as UpcomingIcon
} from '@mui/icons-material'
import Layout from '../../components/common/Layout'
import VocCard from '../../components/cards/VocCard'
import { openModal, showConfirmDialog } from '../../store/slices/uiSlice'
import { fetchVocs, deleteVoc } from '../../store/actions/vocActions'
import { notify } from '../../utils/notify'

const ITEMS_PER_PAGE = 12

const VocPage = () => {
  const { vocs = [], loading = false, error } = useSelector((state) => state.voc || {})
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    dispatch(fetchVocs())
  }, [dispatch])

  const handleTabChange = useCallback((event, newValue) => {
    setActiveTab(newValue)
    setCurrentPage(1)
  }, [])

  const filteredVocs = useMemo(() => {
    if (!Array.isArray(vocs)) return []
    return vocs.filter((voc) => {
      if (!voc) return false
      const matchesTab = activeTab === 0 || 
        (activeTab === 1 && voc.status?.toLowerCase() === 'ongoing') ||
        (activeTab === 2 && voc.status?.toLowerCase() === 'completed')
      return matchesTab
    })
  }, [vocs, activeTab])

  const paginatedVocs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredVocs.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredVocs, currentPage])

  const totalPages = Math.ceil(filteredVocs.length / ITEMS_PER_PAGE)

  // Calculate stats
  const stats = useMemo(() => {
    const totalCount = vocs.length
    const ongoingCount = vocs.filter((v) => v?.status?.toLowerCase() === 'ongoing').length
    const completedCount = vocs.filter((v) => v?.status?.toLowerCase() === 'completed').length
    const upcomingCount = vocs.filter((v) => v?.status?.toLowerCase() === 'upcoming').length
    return { totalCount, ongoingCount, completedCount, upcomingCount }
  }, [vocs])

  const LoadingSkeleton = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 3 }}>
      {[...Array(6)].map((_, index) => (
        <Card key={index} sx={{ height: 320, borderRadius: '12px' }}>
          <CardContent>
            <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} variant="text" sx={{ mb: 1 }} />
            ))}
            <Skeleton variant="rectangular" height={30} sx={{ mt: 2 }} />
          </CardContent>
        </Card>
      ))}
    </Box>
  )

  return (
    <Layout>
      <Box sx={{ pb: 8 }}>
        {/* Tabs */}
        <Card sx={{ mb: 3, borderRadius: '12px' }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                icon={<ProjectIcon sx={{ fontSize: 18 }} />}
                label={`All Projects (${stats.totalCount})`}
                iconPosition="start"
              />
              <Tab
                icon={<OngoingIcon sx={{ fontSize: 18 }} />}
                label={`Ongoing (${stats.ongoingCount})`}
                iconPosition="start"
              />
              <Tab
                icon={<CompletedIcon sx={{ fontSize: 18 }} />}
                label={`Completed (${stats.completedCount})`}
                iconPosition="start"
              />
            </Tabs>
            <Button
              variant="contained"
              onClick={() => dispatch(openModal({ modalName: 'vocForm' }))}
              sx={{ 
                minWidth: 'auto',
                width: 48,
                height: 48,
                borderRadius: '50%',
                p: 0
              }}
            >
              <Add sx={{ fontSize: 24 }} />
            </Button>
          </Box>
        </Card>

        {/* Results Section */}
        <Box>
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {filteredVocs.length > 0 ? (
                <>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                      gap: 3,
                      mb: 4,
                    }}
                  >
                    {paginatedVocs.map((voc) => (
                      <Box key={voc._id} sx={{ animation: 'fadeIn 0.3s ease', height: 'fit-content' }}>
                        <VocCard voc={voc} onEdit={() => dispatch(openModal({ modalName: 'vocForm', data: voc }))} />
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
                    <ProjectIcon sx={{ fontSize: 64, mb: 1 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    No VOC projects found
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Try adjusting your search or filters to find what you're looking for
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => {
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

export default VocPage