import React from "react";
import Rout from "../Rout/Rout";
import "./Form.scss";
const Form = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit");
  };

  return (
    <div className='form-wrapper'>
      <form onSubmit={handleSubmit}>
        <Rout />
        <input type='submit' className='button' />
      </form>
    </div>
  );
};
export default Form;
