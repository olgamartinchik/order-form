import React from "react";
import Route from "../Route/Route";
import UserData from "../UserData/UserData";
import "./Form.scss";
const Form = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit");
  };
  const handleBack = () => {
    console.log("back");
  };

  return (
    <div className='form-wrapper'>
      <form onSubmit={handleSubmit}>
        <Route />
        {/* <UserData /> */}
        <div>
          <button className='button continue-btn' onClick={handleBack}>
            Назад
          </button>
          <input type='submit' className='button' disabled />
        </div>
      </form>
    </div>
  );
};
export default Form;
