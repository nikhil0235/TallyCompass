import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box, Typography } from '@mui/material'
import { Edit, Delete, Visibility } from '@mui/icons-material'
import LoadingSpinner from './LoadingSpinner'
import Pagination from './Pagination'

const DataTable = ({ 
  columns, 
  data, 
  loading = false, 
  onEdit, 
  onDelete, 
  onView,
  title,
  pagination = null
}) => {
  if (loading) return <LoadingSpinner />

  return (
    <Box>
      {title && (
        <Typography variant="h6" sx={{ mb: 2 }}>
          {title}
        </Typography>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} sx={{ fontWeight: 'bold' }}>
                  {column.label}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row._id}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {column.render ? column.render(row[column.id], row) : row[column.id]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {onView && (
                        <IconButton size="small" onClick={() => onView(row)}>
                          <Visibility />
                        </IconButton>
                      )}
                      {onEdit && (
                        <IconButton size="small" onClick={() => onEdit(row)}>
                          <Edit />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton size="small" onClick={() => onDelete(row)}>
                          <Delete />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={pagination.onPageChange}
          onItemsPerPageChange={pagination.onItemsPerPageChange}
          pageSizeOptions={pagination.pageSizeOptions}
        />
      )}
    </Box>
  )
}

export default DataTable