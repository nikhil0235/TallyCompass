import { Grid, Typography, Box } from '@mui/material'
import { People, Inventory, Feedback, Search, RecordVoiceOver } from '@mui/icons-material'
import Layout from '../../components/common/Layout'
import StatsCard from '../../components/cards/StatsCard'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardStats } from '../../store/slices/dashboardSlice'

const DashboardPage = () => {
  const dispatch = useDispatch()
  const { stats, loading, error } = useSelector((state) => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardStats())
  }, [])

  const keyMetrics = stats?.keyMetrics || {}

  return (
    <Layout>
      <Box sx={{ mb: { xs: 3, sm: 4 }, width: '100%' }}>
        <Typography 
          variant="h4" 
          component="h1" 
          fontWeight={700}
          sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}
        >
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to your customer feedback management system
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ width: '100%' }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Total Customers"
            value={keyMetrics.totalCustomers || 0}
            icon={<People />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Active VOC Projects"
            value={keyMetrics.activeVOCProjects || 0}
            icon={<RecordVoiceOver />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Average Rating"
            value={keyMetrics.averageCustomerRating || 0}
            icon={<Feedback />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Pending Requests"
            value={keyMetrics.pendingRequests || 0}
            icon={<Search />}
            color="success"
          />
        </Grid>
      </Grid>
    </Layout>
  )
}

export default DashboardPage