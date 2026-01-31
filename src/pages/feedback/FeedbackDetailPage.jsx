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
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Star as StarIcon
} from '@mui/icons-material';
import Layout from '../../components/common/Layout';
import feedbackService from '../../services/feedbackService';
import { Avatar } from '@mui/material';

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
      <Box sx={{ pb: 4, maxWidth: 900, mx: 0, pl: 0, pr: 0 }}>
        <Card
          sx={{
            borderRadius: '18px',
            mb: 3,
            boxShadow: '0 8px 32px 0 rgba(76,110,245,0.10)',
            background: `linear-gradient(135deg, ${theme.palette.primary.light}10 0%, ${theme.palette.secondary.light}05 100%)`,
            border: `1.5px solid ${theme.palette.divider}`,
            ml: 0, // flush left
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
              {feedback.customerId?.companyName?.charAt(0)?.toUpperCase() || 'A'}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px', color: 'white' }}>
                {feedback.customerId?.companyName || 'Company Name'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', opacity: 0.85 }}>
                {feedback.customerId?.businessType || 'Business type not specified'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Rating value={feedback.rating || 0} readOnly size="large" sx={{ color: 'gold' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                  {feedback.rating || 0}/5
                </Typography>
              </Box>
            </Box>
            <Box sx={{ flex: 1 }} />
            <Chip
              icon={feedback.medium === 'Email' ? <MailIcon /> : <PhoneIcon />}
              label={feedback.medium || 'Unknown'}
              size="medium"
              sx={{ bgcolor: 'white', color: theme.palette.primary.main, fontWeight: 700, fontSize: '1rem', px: 2, mr: 4 }}
            />
          </Box>
          <CardContent sx={{ p: 4, pt: 2, pl: 4, pr: 4 }}>
            {/* Summary Row - similar to VOC */}
            <Box sx={{
              display: 'flex',
              gap: 2,
              mb: 3,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}>
              <Chip
                icon={<StarIcon sx={{ color: 'gold' }} />}
                label={`${feedback.rating || 0}/5 ★`}
                size="small"
                sx={{ bgcolor: 'success.main', color: 'white', fontWeight: 600, minWidth: '60px' }}
              />
              <Chip
                label={feedback.medium || 'Unknown'}
                size="small"
                sx={{ bgcolor: 'info.main', color: 'white', fontWeight: 600, minWidth: '70px' }}
                icon={feedback.medium === 'Email' ? <MailIcon /> : <PhoneIcon />}
              />
              <Chip
                label={feedback.customerId?.planType || 'N/A'}
                size="small"
                sx={{ bgcolor: 'warning.main', color: 'white', fontWeight: 600, minWidth: '50px' }}
              />
              <Chip
                label={feedback.customerId?.accountStatus?.toUpperCase() || 'N/A'}
                size="small"
                sx={{ bgcolor: 'secondary.main', color: 'white', fontWeight: 600, minWidth: '60px' }}
              />
              <Chip
                label={feedback.customerId?.businessType || 'N/A'}
                size="small"
                sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600, minWidth: '80px' }}
              />
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
                Feedback Summary
              </Typography>
              <Box sx={{ flex: 1 }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Last updated: {feedback.updatedAt ? new Date(feedback.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not specified'}
              </Typography>
            </Box>
            <Button
              startIcon={<BackIcon />}
              onClick={() => navigate('/feedback')}
              variant="outlined"
              sx={{ mb: 2, borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
            >
              Back
            </Button>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', mb: 1 }}>
                Feedback
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
                “{feedback.description || 'No description provided'}”
              </Typography>
            </Box>
            <Stack direction="row" spacing={4} sx={{ mb: 3 }}>
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
                <Chip label={feedback.customerId?.planType || 'N/A'} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600, mt: 0.5 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Account Status
                </Typography>
                <Chip label={feedback.customerId?.accountStatus?.toUpperCase() || 'N/A'} size="small" color="success" variant="outlined" sx={{ fontWeight: 600, mt: 0.5 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  User Level
                </Typography>
                <Chip label={`${feedback.customerId?.customerProficiency?.toUpperCase() || 'N/A'} USER`} size="small" color="info" variant="outlined" sx={{ fontWeight: 600, mt: 0.5 }} />
              </Box>
            </Stack>
            <Divider sx={{ mb: 3 }} />
            <Stack direction="row" spacing={4}>
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
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default FeedbackDetailPage;
