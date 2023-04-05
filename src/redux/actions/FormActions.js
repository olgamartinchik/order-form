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
export const DeleteFormAction = () => (dispatch, getState) => {
  // const { Form } = getState();

  // Object.entries(newForm).forEach(([key, value]) => {
  //   Form[key] = value;
  // });

  dispatch({
    type: Actions.DELETE_FORM_DATA,
    payload: { from: null, to: null },
  });
};
