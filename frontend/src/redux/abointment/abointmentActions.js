import axios from "axios";
import {
  GET_APPOINTMENTS_LIST_SUCCESS,
  GET_APPOINTMENTS_LIST_FAIL,
  GET_APPOINTMENT_DETAIL_SUCCESS,
  GET_APPOINTMENT_DETAIL_FAIL,
  CREATE_APPOINTMENT_SUCCESS,
  CREATE_APPOINTMENT_FAIL,

} from "./abointmentTypes";

// GET APPOINTMENT

export const getABNTs = () => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/appointments/`,
        config
      );

      dispatch({
        type: GET_APPOINTMENTS_LIST_SUCCESS,
        payload: res.data,
      });

    } catch (err) {
      dispatch({
        type: GET_APPOINTMENTS_LIST_FAIL,
      });
    }
  } else {
    dispatch({
      type: GET_APPOINTMENTS_LIST_FAIL,
    });
  }
};



// GET APPOINTMENT DETAIL


export const getABNTSDetail = (id) => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/appointments/${id}/`,
        config
      );

      dispatch({
        type: GET_APPOINTMENT_DETAIL_SUCCESS,
        payload: res.data,
      });

    } catch (err) {
      dispatch({
        type: GET_APPOINTMENT_DETAIL_FAIL,
      });
    }
  } else {
    dispatch({
      type: GET_APPOINTMENT_DETAIL_FAIL,
    });
  }
};






// CREATE APPOINTMENT 

export const createABNT = (formData) => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/appointments/`,
        // config,
        formData
      );

      dispatch({
        type: CREATE_APPOINTMENT_SUCCESS,
        payload: res.data,
      });

    } catch (err) {
      dispatch({
        type: CREATE_APPOINTMENT_FAIL,
      });
    }
  } else {
    dispatch({
      type: GET_APPOINTMENT_DETAIL_FAIL,
    });
  }
};



