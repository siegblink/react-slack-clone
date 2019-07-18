import { combineReducers } from 'redux'
import * as actionType from '../actions/types'

const initialUserState = {
  currentUser: null,
  isLoading: true,
}

export const user_reducer = (state = initialUserState, action) => {
  switch (action.type) {
    case actionType.SET_USER:
      return {
        ...state,
        currentUser: action.payload.currentUser,
        isLoading: false,
      }
    default:
      return state
  }
}

export const rootReducer = combineReducers({
  user: user_reducer,
})
