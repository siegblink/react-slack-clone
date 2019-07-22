import { combineReducers } from 'redux'
import * as actionTypes from '../actions/types'

const initialUserState = {
  currentUser: null,
  isLoading: true,
}

export const user_reducer = (state = initialUserState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        currentUser: action.payload.currentUser,
        isLoading: false,
      }
    case actionTypes.CLEAR_USER:
      return {
        ...initialUserState,
        isLoading: false,
      }
    default:
      return state
  }
}

export const rootReducer = combineReducers({
  user: user_reducer,
})
