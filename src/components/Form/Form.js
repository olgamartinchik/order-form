import React from "react";
import Route from "../Route/Route";
import UserData from "../UserData/UserData";
import "./Form.scss";
import { useSelector } from "react-redux";
import { AddFormAction } from "../../redux/actions/FormActions";
import { useDispatch } from "react-redux";
const Form = () => {
  const state = useSelector((state) => state.Form);
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit");
  };
  const handleBack = (e) => {
    e.preventDefault();
    console.log("back");
    dispatch(
      AddFormAction({
        isUserData: false,
      })
    );
  };

  return (
    <div className='form-wrapper'>
      <form onSubmit={handleSubmit}>
        <Route />

        {state.isUserData && (
          <div>
            <UserData />
            {state.price && <h3>Стоимость трансфера: ~{state.price} б.р.</h3>}
            <div className='button-container'>
              <button className='button continue-btn' onClick={handleBack}>
                Назад
              </button>
              <input type='submit' className='button' disabled />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
export default Form;
