import { Actions } from "../../utils/constants";
import { initialState } from "../../utils/constants";

const FormReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.ADD_FORM_DATA:
      return { ...state, ...action.payload };
    case Actions.DELETE_FORM_DATA:
      return action.payload;
    default:
      return state;
  }
};
export default FormReducer;
