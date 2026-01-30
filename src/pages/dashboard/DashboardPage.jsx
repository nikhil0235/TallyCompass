import {
  Grid,
  Typography,
  Box,
  Paper,
  Stack
} from '@mui/material'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  LabelList
} from 'recharts'
import Layout from '../../components/common/Layout'

const metrics = [
  { title: 'Total Feedback', value: '12,450', sub: '+5.2% this month' },
  { title: 'Satisfaction Rate', value: '84%', sub: 'Overall score' },
  { title: 'Response Time', value: '2.3 hrs', sub: 'Average' }
]

const feedbackTrend = [
  { month: 'Jan', value: 20 },
  { month: 'Feb', value: 35 },
  { month: 'Mar', value: 30 },
  { month: 'Apr', value: 45 },
  { month: 'May', value: 55 }
]

const categories = [
  { name: 'Product Issues', value: 40 },
  { name: 'Service Complaints', value: 25 },
  { name: 'Suggestions', value: 20 },
  { name: 'Praise', value: 15 }
]

const sentiment = [
  { name: 'Positive', value: 65 },
  { name: 'Neutral', value: 20 },
  { name: 'Negative', value: 15 }
]

const responseTrend = [
  { day: 'Mon', value: 30 },
  { day: 'Tue', value: 40 },
  { day: 'Wed', value: 35 },
  { day: 'Thu', value: 50 },
  { day: 'Fri', value: 60 }
]

const COLORS = ['#2563eb', '#22c55e', '#facc15', '#fb923c']

const DashboardPage = () => {
  return (
    <Layout>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', p: 4 }}>

        {/* Metric Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {metrics.map((m, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center', minHeight: 160 }}>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {m.title}
                </Typography>
                <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
                  {m.value}
                </Typography>
                <Typography variant="body1" color="#16a34a">
                  {m.sub}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Primary Charts */}
        <Grid container spacing={3}>
          {/* Feedback Trends */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 4, borderRadius: 2, height: 400 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Feedback Trends
              </Typography>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={feedbackTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]}>
                    <LabelList dataKey="value" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Feedback Categories */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 4, borderRadius: 2, height: 400 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Feedback Categories
              </Typography>

              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categories.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Scroll Section */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center', minHeight: 180 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Survey Completion
              </Typography>
              <Typography variant="h2" fontWeight={700} color="#2563eb">
                78%
              </Typography>
              <Typography color="text.secondary">Completed</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center', minHeight: 180 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Customer Sentiment
              </Typography>
              {sentiment.map((s) => (
                <Typography key={s.name} variant="h6">
                  {s.name}: {s.value}%
                </Typography>
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center', minHeight: 180 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Avg Response Trend
              </Typography>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={responseTrend}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#22c55e"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Full-width Chart */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 4, borderRadius: 2, height: 350 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Customer Engagement Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={feedbackTrend}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#2563eb"
                    fill="#93c5fd"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

      </Box>
    </Layout>
  )
}

export default DashboardPage
