import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import FormReducer from "./reducer/FormReducer";
import { initialState } from "../utils/constants";

const reducer = combineReducers({
  Form: FormReducer,
});

const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);
export default store;
