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
  Rating,
  useTheme,
  CircularProgress,
  Avatar,
  Grid,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Star as StarIcon,
  CheckCircle as CompletedIcon,
  AttachFile as FileIcon,
  Group as GroupIcon,
  TrendingUp as ProgressIcon
} from '@mui/icons-material';
import Layout from '../../components/common/Layout';
import feedbackService from '../../services/feedbackService';


const FeedbackDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      feedbackService.getById(id)
        .then(data => setFeedback(data))
        .catch(() => setError('Feedback not found'))
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

  if (error || !feedback) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Card sx={{ p: 4, textAlign: 'center', borderRadius: '14px', border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" color="error" sx={{ mb: 2, fontWeight: 700 }}>
              Feedback Not Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              The feedback you're looking for doesn't exist or has been removed.
            </Typography>
            <Button variant="contained" startIcon={<BackIcon />} onClick={() => navigate('/feedback')}>
              Back to Feedback
            </Button>
          </Card>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ pb: 4, maxWidth: 1100, mx: 'auto', px: { xs: 1, md: 0 } }}>
        {/* Hero Card */}
        <Card
          sx={{
            borderRadius: '22px',
            mb: 4,
            boxShadow: '0 8px 32px 0 rgba(76,110,245,0.10)',
            background: `linear-gradient(135deg, ${theme.palette.primary.light}10 0%, ${theme.palette.secondary.light}05 100%)`,
            border: `1.5px solid ${theme.palette.divider}`,
            position: 'relative',
            overflow: 'visible',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              px: { xs: 2, md: 5 },
              pt: 5,
              pb: 3,
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 60%, ${theme.palette.secondary.main} 100%)`,
              borderTopLeftRadius: '22px',
              borderTopRightRadius: '22px',
              color: 'white',
              minHeight: 120,
            }}
          >
            <Button startIcon={<BackIcon />} onClick={() => navigate('/feedback')} variant="contained" sx={{ borderRadius: '50px', fontWeight: 700, mr: 2, bgcolor: 'white', color: theme.palette.primary.main, boxShadow: 2 }}>
              Back
            </Button>
            <Avatar sx={{ width: 64, height: 64, fontWeight: 700, fontSize: 32, bgcolor: 'white', color: theme.palette.primary.main }}>
              {feedback.customerId?.companyName?.charAt(0)?.toUpperCase() || 'A'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-1px', color: 'white', mb: 0.5 }}>
                {feedback.customerId?.companyName || 'Company Name'}
              </Typography>
              <Typography variant="body1" sx={{ color: 'white', opacity: 0.85, fontWeight: 500 }}>
                {feedback.customerId?.businessType || 'Business type not specified'}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip label={feedback.customerId?.planType || 'N/A'} size="small" sx={{ bgcolor: 'warning.main', color: 'white', fontWeight: 700, borderRadius: '12px' }} />
                <Chip label={feedback.customerId?.accountStatus?.toUpperCase() || 'N/A'} size="small" sx={{ bgcolor: 'secondary.main', color: 'white', fontWeight: 700, borderRadius: '12px' }} />
                <Chip label={feedback.customerId?.businessType || 'N/A'} size="small" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700, borderRadius: '12px' }} />
                <Chip label={feedback.medium || 'Unknown'} size="small" sx={{ bgcolor: 'info.main', color: 'white', fontWeight: 700, borderRadius: '12px' }} icon={feedback.medium === 'Email' ? <MailIcon /> : <PhoneIcon />} />
              </Stack>
            </Box>
            <Box sx={{ textAlign: 'right', minWidth: 120 }}>
              <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                Last updated: {feedback.updatedAt ? new Date(feedback.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not specified'}
              </Typography>
            </Box>
          </Box>
          <CardContent sx={{ p: { xs: 2, md: 5 }, pt: 3, pb: 4 }}>
            {/* Summary Badges Row */}
            <Grid container spacing={3} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                  <Tooltip title="Rating">
                    <Chip icon={<StarIcon sx={{ color: 'gold' }} />} label={`${feedback.rating || 0}/5 ★`} size="medium" sx={{ fontWeight: 700, borderRadius: '16px', bgcolor: 'white', color: theme.palette.primary.main }} />
                  </Tooltip>
                  <Tooltip title="Progress">
                    <Chip icon={<ProgressIcon sx={{ color: theme.palette.info.main }} />} label={`0% done`} size="medium" sx={{ fontWeight: 700, borderRadius: '16px', bgcolor: 'white', color: theme.palette.info.main }} />
                  </Tooltip>
                  <Tooltip title="Files">
                    <Chip icon={<FileIcon sx={{ color: theme.palette.secondary.main }} />} label={`0 files`} size="medium" sx={{ fontWeight: 700, borderRadius: '16px', bgcolor: 'white', color: theme.palette.secondary.main }} />
                  </Tooltip>
                  <Tooltip title="Completed">
                    <Chip icon={<CompletedIcon sx={{ color: theme.palette.success.main }} />} label={`COMPLETED`} size="medium" sx={{ fontWeight: 700, borderRadius: '16px', bgcolor: 'white', color: theme.palette.success.main }} />
                  </Tooltip>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', mb: 1 }}>
                    Feedback
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      p: 3,
                      background: theme.palette.action.hover,
                      borderRadius: '14px',
                      fontStyle: 'italic',
                      fontSize: '1.15rem',
                      color: theme.palette.text.primary,
                      boxShadow: '0 2px 8px 0 rgba(76,110,245,0.04)'
                    }}
                  >
                    “{feedback.description || 'No description provided'}”
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ mb: 3 }} />
            {/* Two-column summary */}
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                      Date
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                      {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                      Plan Type
                    </Typography>
                    <Chip label={feedback.customerId?.planType || 'N/A'} size="small" color="primary" variant="outlined" sx={{ fontWeight: 700, mt: 0.5, borderRadius: '10px' }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                      Account Status
                    </Typography>
                    <Chip label={feedback.customerId?.accountStatus?.toUpperCase() || 'N/A'} size="small" color="success" variant="outlined" sx={{ fontWeight: 700, mt: 0.5, borderRadius: '10px' }} />
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                      User Level
                    </Typography>
                    <Chip label={`${feedback.customerId?.customerProficiency?.toUpperCase() || 'N/A'} USER`} size="small" color="info" variant="outlined" sx={{ fontWeight: 700, mt: 0.5, borderRadius: '10px' }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                      Contact Person
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                      {feedback.customerId?.contactPersonName || 'Not specified'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                      Phone
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                      {feedback.customerId?.contactNo || 'Not specified'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                      Location
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                      {feedback.customerId?.location?.country || 'N/A'}, {feedback.customerId?.location?.state || 'N/A'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                      Company URL
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                      <a href={feedback.customerId?.companyDataURL} target="_blank" rel="noopener noreferrer" style={{ color: theme.palette.primary.main, textDecoration: 'underline' }}>
                        {feedback.customerId?.companyDataURL || 'N/A'}
                      </a>
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default FeedbackDetailPage;
