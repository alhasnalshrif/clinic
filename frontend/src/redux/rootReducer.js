import { combineReducers } from "redux";
import abointmentReducer from "./abointment/abointmentReducer";
import userReducer from "./user/userReducer";
import patientReducer from "./patient/patientReducer";
import billReducer from "./bill/billReducer";

const rootReducer = combineReducers({
  Abointments: abointmentReducer,
  auth: userReducer,
  patient: patientReducer,
  bill: billReducer,
});

export default rootReducer;
