import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { closeModal } from '../../store/slices/uiSlice'

const DetailModal = () => {
  const { detailModal } = useSelector((state) => state.ui)
  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(closeModal('detailModal'))
  }

  const renderContent = () => {
    if (!detailModal.data) return null

    const { data, type } = detailModal

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.entries(data).map(([key, value]) => {
          if (key === '_id' || key === '__v') return null
          
          return (
            <Box key={key}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </Typography>
              <Typography variant="body1">
                {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
              </Typography>
            </Box>
          )
        })}
      </Box>
    )
  }

  return (
    <Dialog open={detailModal.open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textTransform: 'capitalize' }}>
        {detailModal.type} Details
      </DialogTitle>
      <DialogContent>
        {renderContent()}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default DetailModal