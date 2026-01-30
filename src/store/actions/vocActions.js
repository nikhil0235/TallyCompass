import vocService from '../../services/vocService'
import { vocRequest, vocSuccess, createVocSuccess, updateVocSuccess, deleteVocSuccess, vocFailure } from '../slices/vocSlice'
import { notify } from '../../utils/notify'

export const fetchVocs = () => async (dispatch) => {
  try {
    dispatch(vocRequest())
    const data = await vocService.getAll()
    dispatch(vocSuccess(Array.isArray(data) ? data : []))
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message
    dispatch(vocFailure(errorMessage))
    notify.error(errorMessage)
  }
}

export const createVoc = (vocData) => async (dispatch) => {
  try {
    dispatch(vocRequest())
    const data = await vocService.create(vocData)
    dispatch(createVocSuccess(data))
    return data
  } catch (error) {
    dispatch(vocFailure(error.response?.data?.message || error.message))
    throw error
  }
}

export const updateVoc = (id, vocData) => async (dispatch) => {
  try {
    dispatch(vocRequest())
    const data = await vocService.update(id, vocData)
    dispatch(updateVocSuccess(data))
    return data
  } catch (error) {
    dispatch(vocFailure(error.response?.data?.message || error.message))
    throw error
  }
}

export const deleteVoc = (id) => async (dispatch) => {
  try {
    dispatch(vocRequest())
    await vocService.delete(id)
    dispatch(deleteVocSuccess(id))
  } catch (error) {
    dispatch(vocFailure(error.response?.data?.message || error.message))
    throw error
  }
}