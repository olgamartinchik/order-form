import { Actions } from "../../constants";

const initialState = {
  form: { from: null, to: null, cost: null, distance: null, auto: null },
};
const FormReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.ADD_FORM_DATA:
      return { form: action.payload };
    // case Actions.ADD_FROM:
    // case Actions.ADD_TO:
    // case Actions.ADD_COST:
    // case Actions.ADD_DISTANCE:
    // case Actions.ADD_TYPE_AUTO:
    //     case Actions.UPDATE_FROM:
    //         case Actions.UPDATE_TO:
    //         case Actions.UPDATE_COST:
    //         case Actions.UPDATE_DISTANCE:
    //         case Actions.UPDATE_TYPE_AUTO:
    //   return { todos: action.payload };
    // case Actions.COMPLETE_TODO:
    // case Actions.EDIT_TODO:
    // case Actions.DELETE_TODO:

    default:
      return state;
  }
};
export default FormReducer;
