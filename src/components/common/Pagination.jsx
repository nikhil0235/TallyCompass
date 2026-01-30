import { Box, Pagination as MuiPagination, Select, MenuItem, FormControl, Typography } from '@mui/material'

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  pageSizeOptions = [5, 10, 25, 50]
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 2,
      mt: 2,
      p: 2
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {startItem}-{endItem} of {totalItems} items
        </Typography>
        <FormControl size="small">
          <Select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange?.(e.target.value)}
            sx={{ minWidth: 80 }}
          >
            {pageSizeOptions.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => onPageChange?.(page)}
        color="primary"
        showFirstButton
        showLastButton
      />
    </Box>
  )
}

export default Pagination