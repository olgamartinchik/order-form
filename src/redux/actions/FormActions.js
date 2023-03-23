import { Actions } from "../../utils/constants";

export const AddFormAction = (newForm) => (dispatch, getState) => {
  const { Form } = getState();

  Object.entries(newForm).forEach(([key, value]) => {
    Form[key] = value;
  });

  if (newForm) {
    dispatch({
      type: Actions.ADD_FORM_DATA,
      payload: { ...Form },
    });
  }
};
