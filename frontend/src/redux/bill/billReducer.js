import {
  GET_BILLS_LIST_SUCCESS,
  GET_BILLS_LIST_FAIL,
  GET_BILL_DETAIL_SUCCESS,
  GET_BILL_DETAIL_FAIL,
  CREATE_BILL_SUCCESS,
  CREATE_BILL_FAIL,

} from "./billTypes";


const initialState = {
  bills: [],
  billDetail: {},
};


export default function Bill(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_BILLS_LIST_SUCCESS:
      return {
        ...state,
        bills: payload,
      };
    case GET_BILLS_LIST_FAIL:
      return {
        ...state,
        bills: "null",
      };
    case GET_BILL_DETAIL_SUCCESS:
      return {
        ...state,
        billDetail: payload,
      };
    case GET_BILL_DETAIL_FAIL:
      return {
        ...state,
        billDetail: "null",
      };
    case CREATE_BILL_SUCCESS:
      return {
        ...state,
      };
    case CREATE_BILL_FAIL:
      return {
        ...state,
      };

    default:
      return state;
  }
}


