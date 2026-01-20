import toast from 'react-hot-toast'

export const notify = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  loading: (message) => toast.loading(message),
  dismiss: (toastId) => toast.dismiss(toastId),
  promise: (promise, messages) => toast.promise(promise, messages)
}

export default notify