import Form from '../common/Form'

const LoginForm = ({ onSubmit, loading = false }) => {
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
    <Form
      fields={loginFields}
      onSubmit={onSubmit}
      loading={loading}
      submitText="Sign In"
      loadingText="Signing in..."
    />
  )
}

export default LoginForm