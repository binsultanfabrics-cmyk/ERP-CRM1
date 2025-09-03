import * as actionTypes from './types';

const INITIAL_KEY_STATE = {
  result: null,
  current: null,
  isLoading: false,
  isSuccess: false,
};

const INITIAL_STATE = {
  current: {
    result: null,
  },
  list: {
    result: {
      items: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 1,
        showSizeChanger: false,
      },
    },
    isLoading: false,
    isSuccess: false,
  },
  // Add entity-specific lists
  entities: {},
  create: INITIAL_KEY_STATE,
  update: INITIAL_KEY_STATE,
  delete: INITIAL_KEY_STATE,
  read: INITIAL_KEY_STATE,
  search: { ...INITIAL_KEY_STATE, result: [] },
};

const crudReducer = (state = INITIAL_STATE, action) => {
  const { payload, keyState, entity } = action;
  switch (action.type) {
    case actionTypes.RESET_STATE:
      return INITIAL_STATE;
    case actionTypes.CURRENT_ITEM:
      return {
        ...state,
        current: {
          result: payload,
        },
      };
    case actionTypes.REQUEST_LOADING:
      if (keyState === 'list' && entity) {
        // Handle entity-specific list loading
        return {
          ...state,
          entities: {
            ...state.entities,
            [entity]: {
              ...state.entities[entity],
              isLoading: true,
            },
          },
        };
      }
      return {
        ...state,
        [keyState]: {
          ...state[keyState],
          isLoading: true,
        },
      };
    case actionTypes.REQUEST_FAILED:
      if (keyState === 'list' && entity) {
        // Handle entity-specific list failure
        return {
          ...state,
          entities: {
            ...state.entities,
            [entity]: {
              ...state.entities[entity],
              isLoading: false,
              isSuccess: false,
            },
          },
        };
      }
      return {
        ...state,
        [keyState]: {
          ...state[keyState],
          isLoading: false,
          isSuccess: false,
        },
      };
    case actionTypes.REQUEST_SUCCESS:
      if (keyState === 'list' && entity) {
        // Handle entity-specific list success
        return {
          ...state,
          entities: {
            ...state.entities,
            [entity]: {
              result: payload,
              isLoading: false,
              isSuccess: true,
            },
          },
        };
      }
      return {
        ...state,
        [keyState]: {
          result: payload,
          isLoading: false,
          isSuccess: true,
        },
      };
    case actionTypes.CURRENT_ACTION:
      return {
        ...state,
        [keyState]: {
          ...INITIAL_KEY_STATE,
          current: payload,
        },
      };
    case actionTypes.RESET_ACTION:
      return {
        ...state,
        [keyState]: {
          ...INITIAL_STATE[keyState],
        },
      };
    default:
      return state;
  }
};

export default crudReducer;
