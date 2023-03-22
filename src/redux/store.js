import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import FormReducer from "./reducer/FormReduser";

const reducer = combineReducers({
  Form: FormReducer,
});
const initialState = {
  form: { from: null, to: null, cost: null, distance: null, auto: null },
};
const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);
export default store;
