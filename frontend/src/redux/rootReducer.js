import { combineReducers } from "redux";
import userReducer from "./user/userReducer";

const rootReducer = combineReducers({
  auth: userReducer,
});

export default rootReducer;
