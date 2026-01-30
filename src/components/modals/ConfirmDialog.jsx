import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { closeModal } from '../../store/slices/uiSlice'

const ConfirmDialog = () => {
  const { confirmDialog } = useSelector((state) => state.ui)
  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(closeModal('confirmDialog'))
  }

  const handleConfirm = () => {
    if (confirmDialog.onConfirm) {
      confirmDialog.onConfirm()
    }
    handleClose()
  }

  return (
    <Dialog open={confirmDialog.open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{confirmDialog.title}</DialogTitle>
      <DialogContent>
        <Typography>{confirmDialog.message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained" color="error">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog