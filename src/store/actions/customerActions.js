import customerService from '../../services/customerService'
import { 
  customerStart, 
  getCustomersSuccess, 
  getCustomerSuccess,
  createCustomerSuccess,
  updateCustomerSuccess,
  deleteCustomerSuccess,
  customerFailure 
} from '../slices/customerSlice'

export const fetchCustomers = () => async (dispatch) => {
  try {
    dispatch(customerStart())
    const data = await customerService.getAll()
    dispatch(getCustomersSuccess(data))
  } catch (error) {
    dispatch(customerFailure(error.message))
    throw error
  }
}

export const fetchCustomer = (id) => async (dispatch) => {
  try {
    dispatch(customerStart())
    const data = await customerService.getById(id)
    dispatch(getCustomerSuccess(data))
  } catch (error) {
    dispatch(customerFailure(error.message))
    throw error
  }
}

export const createCustomer = (customerData) => async (dispatch) => {
  try {
    dispatch(customerStart())
    const data = await customerService.create(customerData)
    dispatch(createCustomerSuccess(data))
    return data
  } catch (error) {
    dispatch(customerFailure(error.message))
    throw error
  }
}

export const updateCustomer = (id, customerData) => async (dispatch) => {
  try {
    dispatch(customerStart())
    const data = await customerService.update(id, customerData)
    dispatch(updateCustomerSuccess(data))
    return data
  } catch (error) {
    dispatch(customerFailure(error.message))
    throw error
  }
}

export const deleteCustomer = (id) => async (dispatch) => {
  try {
    dispatch(customerStart())
    await customerService.delete(id)
    dispatch(deleteCustomerSuccess(id))
  } catch (error) {
    dispatch(customerFailure(error.message))
    throw error
  }
}