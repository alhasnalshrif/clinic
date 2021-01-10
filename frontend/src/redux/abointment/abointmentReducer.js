import {
  GET_APPOINTMENTS_LIST_SUCCESS,
  GET_APPOINTMENTS_LIST_FAIL,
  GET_APPOINTMENT_DETAIL_SUCCESS,
  GET_APPOINTMENT_DETAIL_FAIL,
  CREATE_APPOINTMENT_SUCCESS,
  CREATE_APPOINTMENT_FAIL,

} from "./abointmentTypes";


const initialState = {
  assignmentes: [],
  assignmentesDetail: {},
};


export default function Abointment(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_APPOINTMENTS_LIST_SUCCESS:
      return {
        ...state,
        assignmentes: payload,
      };
    case GET_APPOINTMENTS_LIST_FAIL:
      return {
        ...state,
        assignmentes: "null",
      };
    case GET_APPOINTMENT_DETAIL_SUCCESS:
      return {
        ...state,
        assignmentesDetail: payload,
      };
    case GET_APPOINTMENT_DETAIL_FAIL:
      return {
        ...state,
        assignmentesDetail: "null",
      };
    case CREATE_APPOINTMENT_SUCCESS:
      return {
        ...state,
      };
    case CREATE_APPOINTMENT_FAIL:
      return {
        ...state,
      };

    default:
      return state;
  }
}


