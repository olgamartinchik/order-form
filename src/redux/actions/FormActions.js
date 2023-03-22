import { Actions } from "../../constants";

export const AddFormAction = (form) => (dispatch, getState) => {
  const { Form } = getState();

  //   const hasTodo = todos.find((item) => item.todo === todo);
  if (form) {
    dispatch({
      type: Actions.ADD_FORM_DATA,
      payload: form,
    });
  }
};
// export const DeleteAction = (todo) => (dispatch, getState) => {
//   const {
//     Todo: { todos },
//   } = getState();

//   dispatch({
//     type: Actions.DELETE_TODO,
//     payload: todos.filter((item) => item.id !== todo.id),
//   });
// };
