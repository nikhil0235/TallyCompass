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
  Avatar
} from '@mui/material';
import { ArrowBack as BackIcon, Assignment as RequestIcon } from '@mui/icons-material';
import Layout from '../../components/common/Layout';
import requestService from '../../services/requestService';

const RequestDetailPage = () => {
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <Box sx={{ pb: 4, maxWidth: 900, mx: 0, pl: 0, pr: 0 }}>
        <Card
          sx={{
            borderRadius: '18px',
            mb: 3,
            boxShadow: '0 8px 32px 0 rgba(76,110,245,0.10)',
            background: `linear-gradient(135deg, ${theme.palette.primary.light}10 0%, ${theme.palette.secondary.light}05 100%)`,
            border: `1.5px solid ${theme.palette.divider}`,
            ml: 0,
            mr: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              px: 0,
              pt: 4,
              pb: 2,
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 60%, ${theme.palette.secondary.main} 100%)`,
              borderTopLeftRadius: '18px',
              borderTopRightRadius: '18px',
              color: 'white',
            }}
          >
            <Avatar sx={{ width: 56, height: 56, fontWeight: 700, fontSize: 28, bgcolor: 'white', color: theme.palette.primary.main, ml: 4 }}>
              <RequestIcon sx={{ fontSize: 36 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px', color: 'white' }}>
                {request.title || 'Request Title'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', opacity: 0.85 }}>
                {request.type?.toUpperCase() || 'Request Type'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Chip label={request.status?.toUpperCase() || 'N/A'} size="small" sx={{ bgcolor: 'success.main', color: 'white', fontWeight: 600, minWidth: '60px' }} />
                <Chip label={request.priority?.toUpperCase() || 'N/A'} size="small" sx={{ bgcolor: 'warning.main', color: 'white', fontWeight: 600, minWidth: '60px' }} />
              </Box>
            </Box>
            <Box sx={{ flex: 1 }} />
            <Chip
              label={`Customers: ${Array.isArray(request.customerList) ? request.customerList.length : 1}`}
              size="medium"
              sx={{ bgcolor: 'white', color: theme.palette.primary.main, fontWeight: 700, fontSize: '1rem', px: 2, mr: 4 }}
            />
          </Box>
          <CardContent sx={{ p: 4, pt: 2, pl: 4, pr: 4 }}>
            {/* Summary Row */}
            <Box sx={{
              display: 'flex',
              gap: 2,
              mb: 3,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}>
              <Chip label={request.status?.toUpperCase() || 'N/A'} size="small" sx={{ bgcolor: 'success.main', color: 'white', fontWeight: 600, minWidth: '60px' }} />
              <Chip label={request.priority?.toUpperCase() || 'N/A'} size="small" sx={{ bgcolor: 'warning.main', color: 'white', fontWeight: 600, minWidth: '60px' }} />
              <Chip label={request.type?.toUpperCase() || 'N/A'} size="small" sx={{ bgcolor: 'info.main', color: 'white', fontWeight: 600, minWidth: '60px' }} />
              <Chip label={`Customers: ${Array.isArray(request.customerList) ? request.customerList.length : 1}`} size="small" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600, minWidth: '80px' }} />
            </Box>
            <Box sx={{
              width: '100%',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}05 100%)`,
              borderRadius: '18px 18px 0 0',
              px: 4,
              py: 2,
              mb: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              borderBottom: `1.5px solid ${theme.palette.divider}`,
            }}>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.5px', color: theme.palette.primary.main }}>
                Request Summary
              </Typography>
              <Box sx={{ flex: 1 }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Last updated: {request.updatedAt ? new Date(request.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not specified'}
              </Typography>
            </Box>
            <Button
              startIcon={<BackIcon />}
              onClick={() => navigate('/requests')}
              variant="outlined"
              sx={{ mb: 2, borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
            >
              Back
            </Button>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', mb: 1 }}>
                Description
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mt: 1,
                  p: 3,
                  background: theme.palette.action.hover,
                  borderRadius: '12px',
                  fontStyle: 'italic',
                  fontSize: '1.15rem',
                  color: theme.palette.text.primary,
                  boxShadow: '0 2px 8px 0 rgba(76,110,245,0.04)'
                }}
              >
                “{request.description || 'No description provided'}”
              </Typography>
            </Box>
            <Stack direction="row" spacing={4} sx={{ mb: 3 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Date
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                  {request.createdAt ? new Date(request.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }) : 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Priority
                </Typography>
                <Chip label={request.priority?.toUpperCase() || 'N/A'} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600, mt: 0.5 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Status
                </Typography>
                <Chip label={request.status?.toUpperCase() || 'N/A'} size="small" color="success" variant="outlined" sx={{ fontWeight: 600, mt: 0.5 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Type
                </Typography>
                <Chip label={request.type?.toUpperCase() || 'N/A'} size="small" color="info" variant="outlined" sx={{ fontWeight: 600, mt: 0.5 }} />
              </Box>
            </Stack>
            <Divider sx={{ mb: 3 }} />
            <Stack direction="row" spacing={4}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Customers
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                  {Array.isArray(request.customerList) ? request.customerList.length : 1}
                </Typography>
              </Box>
              {/* Add more request-specific fields here as needed */}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default RequestDetailPage;
