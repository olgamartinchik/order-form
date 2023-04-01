import React from "react";
import Route from "../Route/Route";
import "./Form.scss";
const Form = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit");
  };

  return (
    <div className='form-wrapper'>
      <form onSubmit={handleSubmit}>
        <Route />

        <input type='submit' className='button' />
      </form>
    </div>
  );
};
export default Form;
