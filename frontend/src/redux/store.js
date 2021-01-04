// import { createStore, applyMiddleware } from "redux";
// import { composeWithDevTools } from "redux-devtools-extension";
// import thunk from "redux-thunk";

// import rootReducer from "./rootReducer";

// const initialState = {};

// const middleware = [thunk];

// const store = createStore(
//   rootReducer,
//   initialState,
//   composeWithDevTools(applyMiddleware(...middleware))
// );

// export default store;


import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
// import logger from 'redux-logger'
import thunk from 'redux-thunk'

import rootReducer from './rootReducer'

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
  // composeWithDevTools(applyMiddleware(logger, thunk))
)

export default store
