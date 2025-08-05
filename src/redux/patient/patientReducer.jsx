import {
  GET_PATIENTS_LIST_SUCCESS,
  GET_PATIENTS_LIST_FAIL,
  GET_PATIENT_DETAIL_SUCCESS,
  GET_PATIENT_DETAIL_FAIL,
  CREATE_PATIENT_SUCCESS,
  CREATE_PATIENT_FAIL,
} from "./patientTypes";


const initialState = {
  patients: [],
  patientsDetail: {},

};


export default function Patient(state = initialState, action) {
  const { type, payload } = action;


  switch (type) {
    case GET_PATIENTS_LIST_SUCCESS:
      return {
        ...state,
        patients: payload,
      };
    case GET_PATIENTS_LIST_FAIL:
      return {
        ...state,
        patients: [],
      };
    case GET_PATIENT_DETAIL_SUCCESS:
      return {
        ...state,
        patientsDetail: payload,
      };
    case GET_PATIENT_DETAIL_FAIL:
      return {
        ...state,
        patientsDetail: {},
      };
    case CREATE_PATIENT_SUCCESS:
      return {
        ...state,
      };
    case CREATE_PATIENT_FAIL:
      return {
        ...state,
      };
    default:
      return state;
  }
}


