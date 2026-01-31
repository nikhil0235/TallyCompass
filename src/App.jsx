import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import HomePage from './pages/HomePage'
import AuthPage from './pages/auth/AuthPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import Dashboard from './pages/Dashboard'
import CustomersPage from './pages/customers/CustomersPage'
import ProductsPage from './pages/products/ProductsPage'
import FeedbackPage from './pages/feedback/FeedbackPage'
import RequestsPage from './pages/requests/RequestsPage'
import VocPage from './pages/voc/VocPage'
import VocDetailPage from './pages/voc/VocDetailPage'
import ProfilePage from './pages/profile/ProfilePage'
import ProtectedRoute from './components/common/ProtectedRoute'
import ConfirmDialog from './components/modals/ConfirmDialog'
import DetailModal from './components/modals/DetailModal'
import CustomerForm from './components/forms/CustomerForm'
import ProductForm from './components/forms/ProductForm'
import FeedbackForm from './components/forms/FeedbackForm'
import VocForm from './components/forms/VocFormModular'
import { Box, CircularProgress } from '@mui/material'
import './App.css'

function App() {
  const { isAuthenticated, isInitialized } = useSelector((state) => state.auth)

  if (!isInitialized) {
    return (
      <Box 
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    )
  }

  return (
    <Router>
      <Routes>
        {/* Reset Password Route - Must be first */}
        <Route 
          path="/reset-password" 
          element={<ResetPasswordPage />} 
        />
        
        {/* Public Auth Routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />} 
        />
        <Route 
          path="/forgot-password" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />} 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/customers" 
          element={
            <ProtectedRoute>
              <CustomersPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/products" 
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/feedback" 
          element={
            <ProtectedRoute>
              <FeedbackPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/requests" 
          element={
            <ProtectedRoute>
              <RequestsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/voc" 
          element={
            <ProtectedRoute>
              <VocPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/voc/:id" 
          element={
            <ProtectedRoute>
              <VocDetailPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Default Route */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <HomePage />} 
        />
        
        {/* Catch-all route */}
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
      
      {/* Global Modals */}
      <ConfirmDialog />
      <DetailModal />
      <CustomerForm />
      <ProductForm />
      <FeedbackForm />
      <VocForm />
    </Router>
  )
}

export default App
