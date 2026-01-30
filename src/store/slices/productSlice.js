import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    productStart: (state) => {
      state.loading = true
      state.error = null
    },
    getProductsSuccess: (state, action) => {
      state.loading = false
      state.products = action.payload
    },
    getProductSuccess: (state, action) => {
      state.loading = false
      state.currentProduct = action.payload
    },
    createProductSuccess: (state, action) => {
      state.loading = false
      state.products.push(action.payload)
    },
    updateProductSuccess: (state, action) => {
      state.loading = false
      const index = state.products.findIndex(p => p._id === action.payload._id)
      if (index !== -1) {
        state.products[index] = action.payload
      }
      if (state.currentProduct?._id === action.payload._id) {
        state.currentProduct = action.payload
      }
    },
    deleteProductSuccess: (state, action) => {
      state.loading = false
      state.products = state.products.filter(p => p._id !== action.payload)
      if (state.currentProduct?._id === action.payload) {
        state.currentProduct = null
      }
    },
    productFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    clearProductError: (state) => {
      state.error = null
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null
    }
  }
})

export const {
  productStart,
  getProductsSuccess,
  getProductSuccess,
  createProductSuccess,
  updateProductSuccess,
  deleteProductSuccess,
  productFailure,
  clearProductError,
  clearCurrentProduct
} = productSlice.actions

export default productSlice.reducer