import customerRequestService from '../../services/customerRequestService'
import { 
  requestStart, 
  getRequestsSuccess, 
  getRequestSuccess,
  createRequestSuccess,
  updateRequestSuccess,
  deleteRequestSuccess,
  requestFailure 
} from '../slices/requestSlice'

export const fetchRequests = () => async (dispatch) => {
  try {
    dispatch(requestStart())
    const data = await customerRequestService.getAll()
    dispatch(getRequestsSuccess(data))
  } catch (error) {
    dispatch(requestFailure(error.message))
    throw error
  }
}

export const fetchRequest = (id) => async (dispatch) => {
  try {
    dispatch(requestStart())
    const data = await customerRequestService.getById(id)
    dispatch(getRequestSuccess(data))
  } catch (error) {
    dispatch(requestFailure(error.message))
    throw error
  }
}

export const createRequest = (requestData) => async (dispatch) => {
  try {
    dispatch(requestStart())
    const data = await customerRequestService.create(requestData)
    dispatch(createRequestSuccess(data))
    return data
  } catch (error) {
    dispatch(requestFailure(error.message))
    throw error
  }
}

export const updateRequest = (id, requestData) => async (dispatch) => {
  try {
    dispatch(requestStart())
    const data = await customerRequestService.update(id, requestData)
    dispatch(updateRequestSuccess(data))
    return data
  } catch (error) {
    dispatch(requestFailure(error.message))
    throw error
  }
}

export const updateRequestStatus = (id, status) => async (dispatch) => {
  try {
    dispatch(requestStart())
    const data = await customerRequestService.updateStatus(id, status)
    dispatch(updateRequestSuccess(data))
    return data
  } catch (error) {
    dispatch(requestFailure(error.message))
    throw error
  }
}

export const deleteRequest = (id) => async (dispatch) => {
  try {
    dispatch(requestStart())
    await customerRequestService.delete(id)
    dispatch(deleteRequestSuccess(id))
  } catch (error) {
    dispatch(requestFailure(error.message))
    throw error
  }
}