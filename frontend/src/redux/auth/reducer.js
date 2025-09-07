import * as actionTypes from './types';
import storePersist from '../storePersist';

const INITIAL_STATE = {
  current: {},
  isLoggedIn: false,
  isLoading: false,
  isSuccess: false,
};

const authReducer = (state = INITIAL_STATE, action) => {
  let newState;
  
  switch (action.type) {
    case actionTypes.REQUEST_LOADING:
      newState = {
        ...state,
        isLoggedIn: false,
        isLoading: true,
      };
      break;
      
    case actionTypes.REQUEST_FAILED:
      newState = {
        ...INITIAL_STATE,
        isLoading: false,
      };
      storePersist.remove('auth');
      break;

    case actionTypes.REQUEST_SUCCESS:
      newState = {
        current: action.payload,
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
      };
      storePersist.set('auth', newState);
      break;

    case actionTypes.REGISTER_SUCCESS:
      newState = {
        current: null,
        isLoggedIn: false,
        isLoading: false,
        isSuccess: true,
      };
      storePersist.remove('auth');
      break;
      
    case actionTypes.LOGOUT_SUCCESS:
      newState = INITIAL_STATE;
      storePersist.remove('auth');
      break;

    case actionTypes.LOGOUT_FAILED:
      newState = {
        current: action.payload,
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
      };
      storePersist.set('auth', newState);
      break;

    default:
      return state;
  }
  
  return newState;
};

export default authReducer;
