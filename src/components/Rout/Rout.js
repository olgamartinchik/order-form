import React from "react";
import "./Rout.scss";
import FormMap from "../FormMap/FormMap";

export const Rout = () => {
  const handleContinue = (e) => {
    e.preventDefault();
    console.log("state");
  };

  return (
    <div className={"form-container"}>
      <div className={"rout-container"}>
        <h2>Тип транспорта</h2>
        <button className='button continue-btn' onClick={handleContinue}>
          Далее
        </button>
      </div>
      <FormMap />
    </div>
  );
};
