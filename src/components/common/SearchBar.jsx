import { TextField, InputAdornment, IconButton, Box } from '@mui/material'
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setQuery } from '../../store/slices/searchSlice'

const SearchBar = ({ onSearch, placeholder = "Ask anything about your customers...", fullWidth = true }) => {
  const [value, setValue] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.trim()) {
      dispatch(setQuery(value))
      onSearch(value.trim())
    }
  }

  const handleClear = () => {
    setValue('')
    dispatch(setQuery(''))
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth={fullWidth}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton onClick={handleClear} size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2
          }
        }}
      />
    </Box>
  )
}

export default SearchBar