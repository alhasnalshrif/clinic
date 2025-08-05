import axios from "axios";
import {
  GET_PATIENTS_LIST_SUCCESS,
  GET_PATIENTS_LIST_FAIL,
  GET_PATIENT_DETAIL_SUCCESS,
  GET_PATIENT_DETAIL_FAIL,
  CREATE_PATIENT_SUCCESS,
  CREATE_PATIENT_FAIL,

} from "./patientTypes";

// GET PATIENT

export const getPATN = () => async (dispatch) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/patients/`
      );

      dispatch({
        type: GET_PATIENTS_LIST_SUCCESS,
        payload: res.data,
      });

    } catch (err) {
      console.error('Error fetching patients:', err);
      dispatch({
        type: GET_PATIENTS_LIST_FAIL,
      });
    }
};



// GET PATIENT DETAIL


export const getPATNDetail = (id) => async (dispatch) => {
  // if (localStorage.getItem("access")) {
  //   const config = {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `JWT ${localStorage.getItem("access")}`,
  //       Accept: "application/json",
  //     },
  //   };

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/patient/${id}/`,
        // config
      );

      dispatch({
        type: GET_PATIENT_DETAIL_SUCCESS,
        payload: res.data,
      });

    } catch (err) {
      dispatch({
        type: GET_PATIENT_DETAIL_FAIL,
      });
    }
  // } else {
  //   dispatch({
  //     type: GET_PATIENT_DETAIL_FAIL,
  //   });
  // }
};






// CREATE PATIENT 

export const createPATN = (asnt) => async (dispatch) => {
  // if (localStorage.getItem("access")) {
    // const config = {
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `JWT ${localStorage.getItem("access")}`,
    //     Accept: "application/json",
    //   },
    // };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/patient/`,
        // config,
        asnt
      );

      dispatch({
        type: CREATE_PATIENT_SUCCESS,
        payload: res.data,
      });

    } catch (err) {
      dispatch({
        type: CREATE_PATIENT_FAIL,
      });
    }
  // } else {
  //   dispatch({
  //     type: GET_PATIENT_DETAIL_FAIL,
  //   });
  // }
};



