import {
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_CONFIRM_SUCCESS,
  RESET_PASSWORD_CONFIRM_FAIL,
  // AUTHENTICATED_FAIL,
  // AUTHENTICATED_SUCCESS,
  USER_LOADED_SUCCESS,
  USER_LOADED_FAIL,
  PEOFILE_SUCCESS,
  PEOFILE_FAIL
} from "./userTypes";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: true,
  user: {},
  profile: {}
};

export default function auth(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {

    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        isAuthenticated: true,
        token: payload.token,

      };
    case USER_LOADED_SUCCESS:
      return {
        ...state,
        user: payload,
      };
    case PEOFILE_SUCCESS:
      return {
        ...state,
        profile: payload,
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
      };

    case USER_LOADED_FAIL:
      return {
        ...state,
        user: null,
      };
    case PEOFILE_FAIL:
      return {
        ...state,
        profile: null,
      };
    case SIGNUP_FAIL:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        refresh: null,
        isAuthenticated: false,
        user: null,
      };
    case RESET_PASSWORD_SUCCESS:
    case RESET_PASSWORD_FAIL:
    case RESET_PASSWORD_CONFIRM_SUCCESS:
    case RESET_PASSWORD_CONFIRM_FAIL:
      return {
        ...state,
      };
    default:
      return state;
  }
}
