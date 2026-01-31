import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Divider,
  Stack,
  useTheme,
  CircularProgress,
  Avatar,
  Grid,
  Tooltip,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Assignment as RequestIcon,
  Star as StarIcon,
  CheckCircle as CompletedIcon,
  CheckCircle as CheckCircleIcon,
  AttachFile as FileIcon,
  Group as GroupIcon,
  TrendingUp as ProgressIcon,
  Info as InfoIcon,
  People as PeopleIcon,
  Category as ProductIcon,
  History as HistoryIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import Layout from '../../components/common/Layout';
import requestService from '../../services/requestService';

const RequestDetailPage = () => {
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (id) {
      requestService.getRequestById(id)
        .then(data => setRequest(data))
        .catch(() => setError('Request not found'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error || !request) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Card sx={{ p: 4, textAlign: 'center', borderRadius: '14px', border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" color="error" sx={{ mb: 2, fontWeight: 700 }}>
              Request Not Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              The request you're looking for doesn't exist or has been removed.
            </Typography>
            <Button variant="contained" startIcon={<BackIcon />} onClick={() => navigate('/requests')}>
              Back to Requests
            </Button>
          </Card>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ pb: 4, maxWidth: 1400, mx: 'auto', px: { xs: 1, md: 0 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Main Content Left */}
        <Box sx={{ flex: 2, minWidth: 0 }}>
          {/* Header Card */}
          <Card sx={{ borderRadius: '22px', mb: 4, boxShadow: '0 8px 32px 0 rgba(76,110,245,0.10)', background: `linear-gradient(135deg, ${theme.palette.primary.light}10 0%, ${theme.palette.secondary.light}05 100%)`, border: `1.5px solid ${theme.palette.divider}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, px: { xs: 2, md: 5 }, pt: 5, pb: 3, background: `linear-gradient(90deg, ${theme.palette.primary.main} 60%, ${theme.palette.secondary.main} 100%)`, borderTopLeftRadius: '22px', borderTopRightRadius: '22px', color: 'white', minHeight: 120 }}>
              <Button startIcon={<BackIcon />} onClick={() => navigate('/requests')} variant="contained" sx={{ borderRadius: '50px', fontWeight: 700, mr: 2, bgcolor: 'white', color: theme.palette.primary.main, boxShadow: 2 }}>
                Back
              </Button>
              <Avatar sx={{ width: 64, height: 64, fontWeight: 700, fontSize: 32, bgcolor: 'white', color: theme.palette.primary.main }}>
                <RequestIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-1px', color: 'white', mb: 0.5 }}>
                  {request.requestTitle || request.title || 'Request Title'}
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', opacity: 0.85, fontWeight: 500 }}>
                  {request.description || request.type?.toUpperCase() || 'No description provided'}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Chip label={request.requestType?.toUpperCase() || request.type?.toUpperCase() || 'N/A'} size="small" sx={{ bgcolor: 'info.main', color: 'white', fontWeight: 700, borderRadius: '12px' }} />
                  <Chip label={request.priority?.toUpperCase() || 'N/A'} size="small" sx={{ bgcolor: 'warning.main', color: 'white', fontWeight: 700, borderRadius: '12px' }} />
                  <Chip label={request.action?.status?.toUpperCase() || 'N/A'} size="small" sx={{ bgcolor: 'success.main', color: 'white', fontWeight: 700, borderRadius: '12px' }} />
                  <Chip label={`Customers: ${Array.isArray(request.customterList) ? request.customterList.length : 1}`} size="small" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700, borderRadius: '12px' }} />
                  {request.productId && <Chip label={`Product: ${request.productId.productName || request.productId.name || request.productId}` } size="small" sx={{ bgcolor: 'secondary.main', color: 'white', fontWeight: 700, borderRadius: '12px' }} />}
                </Stack>
              </Box>
              <Box sx={{ textAlign: 'right', minWidth: 120 }}>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                  Created: {request.createdAt ? new Date(request.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not specified'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                  Updated: {request.updatedAt ? new Date(request.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not specified'}
                </Typography>
              </Box>
            </Box>
            {/* Tabs */}
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: { xs: 2, md: 5 }, pt: 2, borderBottom: `1.5px solid ${theme.palette.divider}` }} variant="scrollable" scrollButtons="auto">
              <Tab icon={<InfoIcon />} label="Overview" />
              <Tab icon={<DescriptionIcon />} label="Description" />
              <Tab icon={<ProductIcon />} label="Product" />
              <Tab icon={<PeopleIcon />} label={`Customers${Array.isArray(request.customterList) ? ` (${request.customterList.length})` : ''}`} />
              <Tab icon={<FileIcon />} label="Media" />
              <Tab icon={<HistoryIcon />} label="Activity" />
            </Tabs>
            <Divider sx={{ mb: 0 }} />
            {/* Tab Content */}
            <Box sx={{ p: { xs: 2, md: 5 }, pt: 3, pb: 4 }}>
              {tab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ p: 3, borderRadius: '16px', boxShadow: 3, bgcolor: '#f4fafe', color: 'info.main', display: 'flex', alignItems: 'center', gap: 2 }}>
                      <InfoIcon sx={{ fontSize: 32, color: 'info.main' }} />
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'info.main' }}>Request Type</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>{request.requestType?.toUpperCase() || request.type?.toUpperCase() || 'N/A'}</Typography>
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ p: 3, borderRadius: '16px', boxShadow: 3, bgcolor: '#fffde7', color: 'warning.main', display: 'flex', alignItems: 'center', gap: 2 }}>
                      <StarIcon sx={{ fontSize: 32, color: 'warning.main' }} />
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'warning.main' }}>Priority</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>{request.priority?.toUpperCase() || 'N/A'}</Typography>
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ p: 3, borderRadius: '16px', boxShadow: 3, bgcolor: '#f1f8f6', color: 'success.main', display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CheckCircleIcon sx={{ fontSize: 32, color: 'success.main' }} />
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'success.main' }}>Action Status</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>{request.action?.status?.toUpperCase() || 'N/A'}</Typography>
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, borderRadius: '16px', boxShadow: 3, bgcolor: 'grey.100', color: 'text.primary', display: 'flex', alignItems: 'center', gap: 2 }}>
                      <HistoryIcon sx={{ fontSize: 32, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.secondary' }}>Created / Updated</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {`Created: ${request.createdAt ? new Date(request.createdAt).toLocaleString() : 'N/A'} | Updated: ${request.updatedAt ? new Date(request.updatedAt).toLocaleString() : 'N/A'}`}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              )}
              {tab === 1 && (
                <Paper elevation={2} sx={{ p: 3, borderRadius: '16px', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}><DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Description</Typography>
                  <Typography variant="body1" sx={{ fontStyle: 'italic', fontSize: '1.15rem', color: theme.palette.text.primary }}>{request.description || <Chip label="No description provided" size="small" color="default" />}</Typography>
                </Paper>
              )}
              {tab === 2 && (
                <Paper elevation={2} sx={{ p: 3, borderRadius: '16px', mb: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Avatar sx={{ width: 56, height: 56, bgcolor: 'secondary.main', color: 'white', fontWeight: 700, fontSize: 28 }}>
                    <ProductIcon sx={{ fontSize: 36 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{request.productId?.productName || request.productId?.name || request.productId || 'Product'}</Typography>
                    <Typography variant="body2" color="text.secondary">Version: {request.productId?.version || <Chip label="N/A" size="small" color="default" />}</Typography>
                    <Typography variant="body2" color="text.secondary">Release Date: {request.productId?.releaseDate ? new Date(request.productId.releaseDate).toLocaleDateString() : <Chip label="N/A" size="small" color="default" />}</Typography>
                  </Box>
                </Paper>
              )}
              {tab === 3 && (
                <Grid container spacing={2}>
                  {Array.isArray(request.customterList) && request.customterList.length > 0 ? request.customterList.map((customer, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={customer._id || customer}>
                      <Card sx={{ borderRadius: '14px', boxShadow: 2, p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700 }}>{customer.name?.charAt(0)?.toUpperCase() || 'C'}</Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{customer.name || customer.companyName || 'Customer'}</Typography>
                          <Typography variant="body2" color="text.secondary">{customer.contactNo || customer.email || 'No contact info'}</Typography>
                        </Box>
                      </Card>
                    </Grid>
                  )) : <Typography variant="body2" color="text.secondary">No customers found.</Typography>}
                </Grid>
              )}
              {tab === 4 && (
                <Paper elevation={2} sx={{ p: 3, borderRadius: '16px', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}><FileIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Media</Typography>
                  <Typography variant="body2" color="text.secondary">No media files attached.</Typography>
                </Paper>
              )}
              {tab === 5 && (
                <Paper elevation={2} sx={{ p: 3, borderRadius: '16px', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}><HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Activity</Typography>
                  <Typography variant="body2" color="text.secondary">No activity available.</Typography>
                </Paper>
              )}
            </Box>
          </Card>
        </Box>
      </Box>
    </Layout>
  );
};

export default RequestDetailPage;
