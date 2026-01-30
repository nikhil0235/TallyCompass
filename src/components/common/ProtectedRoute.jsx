import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  const token = localStorage.getItem('token')
  
  // If no token, redirect to homepage instead of login
  if (!isAuthenticated && !token) {
    return <Navigate to="/" replace />
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute