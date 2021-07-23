import axios from "axios";
import {
  GET_BILLS_LIST_SUCCESS,
  GET_BILLS_LIST_FAIL,
  GET_BILL_DETAIL_SUCCESS,
  GET_BILL_DETAIL_FAIL,
  CREATE_BILL_SUCCESS,
  CREATE_BILL_FAIL,

} from "./billTypes";

// GET BILL

export const getBILLS = () => async (dispatch) => {
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
        `${process.env.REACT_APP_API_URL}/payment/`,
        // config
      );

      dispatch({
        type: GET_BILLS_LIST_SUCCESS,
        payload: res.data,
      });

    } catch (err) {
      dispatch({
        type: GET_BILLS_LIST_FAIL,
      });
    }
  // } else {
  //   dispatch({
  //     type: GET_BILLS_LIST_FAIL,
  //   });
  // }
};



// GET BILL DETAIL


export const getBILLDetail = (id) => async (dispatch) => {
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
        `${process.env.REACT_APP_API_URL}/payment/${id}/`,
        // config
      );

      dispatch({
        type: GET_BILL_DETAIL_SUCCESS,
        payload: res.data,
      });

    } catch (err) {
      dispatch({
        type: GET_BILL_DETAIL_FAIL,
      });
    }
  // } else {
  //   dispatch({
  //     type: GET_BILL_DETAIL_FAIL,
  //   });
  // }
};






// CREATE BILL 

export const createBILL = (formData) => async (dispatch) => {
  // if (localStorage.getItem("access")) {
  //   const config = {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `JWT ${localStorage.getItem("access")}`,
  //       Accept: "application/json",
  //     },
  //   };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/payment/`,
        // config,
        formData
      );

      dispatch({
        type: CREATE_BILL_SUCCESS,
        payload: res.data,
      });

    } catch (err) {
      dispatch({
        type: CREATE_BILL_FAIL,
      });
    }
  // } else {
  //   dispatch({
  //     type: GET_BILL_DETAIL_FAIL,
  //   });
  // }
};



