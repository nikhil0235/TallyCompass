import Form from '../common/Form'
import { Link, Typography } from '@mui/material'

const LoginForm = ({ onSubmit, loading = false, onForgotPassword }) => {
  const loginFields = [
    { 
      name: 'email', 
      type: 'email', 
      label: 'Email Address', 
      required: true 
    },
    { 
      name: 'password', 
      type: 'password', 
      label: 'Password', 
      required: true 
    }
  ]

  return (
    <>
      <Form
        fields={loginFields}
        onSubmit={onSubmit}
        loading={loading}
        submitText="Sign In"
        loadingText="Signing in..."
      />
      {onForgotPassword && (
        <Typography 
          variant="body2" 
          sx={{ mt: 2, textAlign: 'center' }}
        >
          <Link 
            component="button" 
            variant="body2" 
            onClick={onForgotPassword}
            sx={{ cursor: 'pointer' }}
          >
            Forgot Password?
          </Link>
        </Typography>
      )}
    </>
  )
}

export default LoginForm