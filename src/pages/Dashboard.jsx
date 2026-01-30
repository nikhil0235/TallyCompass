import { Container, Typography, Box } from '@mui/material'
import Layout from '../components/common/Layout'

const Dashboard = () => {
  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" fontWeight={700}>
            TallyCompass Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
            Voice of Customer Management System
          </Typography>
        </Box>
        
        <Typography variant="h5" fontWeight={600}>
          VOC List
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your customer feedback will appear here.
        </Typography>
      </Container>
    </Layout>
  )
}

export default Dashboard
