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
        ...state,
        isLoading: false,
      }
    default:
      return state
  }
}

const initialChannelState = {
  currentChannel: null,
}

export const channel_reducer = (state = initialChannelState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload.currentChannel,
      }
    default:
      return state
  }
}

export const rootReducer = combineReducers({
  user: user_reducer,
  channel: channel_reducer,
})
