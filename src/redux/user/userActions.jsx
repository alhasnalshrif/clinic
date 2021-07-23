import axios from "axios";
import {
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  ACTIVATION_SUCCESS,
  ACTIVATION_FAIL,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_CONFIRM_SUCCESS,
  RESET_PASSWORD_CONFIRM_FAIL,
  LOGOUT,
  USER_LOADED_SUCCESS,
  USER_LOADED_FAIL,
  // AUTHENTICATED_FAIL,
  // AUTHENTICATED_SUCCESS,
  PEOFILE_SUCCESS,
  PEOFILE_FAIL
} from "./userTypes";




// load user

export const load_user = () => (dispatch, getState) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("access")}`,
      Accept: "application/json",
    },
  };

  try {
    const res = axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/user/`,
      tokenConfig(getState)
    );

    dispatch({
      type: USER_LOADED_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: USER_LOADED_FAIL,
    });
  }

};

// load profile

export const load_profile = (userid) => (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };

    try {
      const res = axios.get(
        `${process.env.REACT_APP_API_URL}/accounts/${userid}/`,
        config
      );

      dispatch({
        type: PEOFILE_SUCCESS,
        payload: res.data,
      });

    } catch (err) {
      dispatch({
        type: PEOFILE_FAIL,
      });
    }
  } else {
    dispatch({
      type: PEOFILE_FAIL,
    });
  }
};

// login

export const login = (username, password) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ username, password });

  try {
    // const res =  axios.post(
    //   `${process.env.REACT_APP_API_URL}/auth/jwt/create/`,
    //   body,
    //   config
    // );
    const res = axios.post(
      `${process.env.REACT_APP_API_URL}/api-token-auth/`,
      body,
      config
    );

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(load_user());
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// signup

export const signup = ({
  name,
  is_teacher,
  is_student,
  phone,
  email,
  password,
  re_password,
}) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({
    name,
    is_teacher,
    is_student,
    phone,
    email,
    password,
    re_password,
  });

  try {
    const res = axios.post(
      `${process.env.REACT_APP_API_URL}/auth/users/`,
      body,
      config
    );

    dispatch({
      type: SIGNUP_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: SIGNUP_FAIL,
    });
  }
};

// activation

export const verify = (uid, token) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ uid, token });

  try {
    const res = axios.post(
      `${process.env.REACT_APP_API_URL}/auth/users/activation/`,
      body,
      config
    );

    dispatch({
      type: ACTIVATION_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: ACTIVATION_FAIL,
    });
  }
};

// reset password

export const reset_password = (email) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email });

  try {
    const res = axios.post(
      `${process.env.REACT_APP_API_URL}/auth/users/reset_password/`,
      body,
      config
    );

    dispatch({
      type: RESET_PASSWORD_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: RESET_PASSWORD_FAIL,
    });
  }
};

export const reset_password_confirm = (
  uid,
  token,
  new_password,
  re_new_password
) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ uid, token, new_password, re_new_password });

  try {
    const res = axios.post(
      `${process.env.REACT_APP_API_URL}/auth/users/reset_password_confirm/`,
      body,
      config
    );

    dispatch({
      type: RESET_PASSWORD_CONFIRM_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: RESET_PASSWORD_CONFIRM_FAIL,
    });
  }
};

// logout

export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};


// Setup config with token - helper function
export const tokenConfig = (getState) => {
  // Get token from state
  const token = getState().auth.token;

  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // If token, add to headers config
  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }

  return config;
};
