import React, { useState } from "react";
import "./Rout.scss";
import FormMap from "../FormMap/FormMap";
import { typesAuto } from "../../constants";
import { useSelector } from "react-redux";

const Rout = () => {
  const [typeAuto, setTypeAuto] = useState("standard");

  const state = useSelector((state) => state.Form.form);

  const handleContinue = (e) => {
    e.preventDefault();
    console.log("state");
  };
  const handleTypeAuto = (e) => {
    console.log("e.target", e.target.value);
    console.log("state store", state);

    setTypeAuto((typeAuto) => (typeAuto = e.target.value));
    console.log("typeAuto", typeAuto);
  };

  return (
    <div className={"form-container"}>
      <div className={"rout-container"}>
        <h2>Тип транспорта</h2>
        <div className='auto-type'>
          {typesAuto.map((type, ind) => (
            <label className='label' key={ind.toString()}>
              <input
                type={"radio"}
                name='auto'
                value={Object.keys(type)[0]}
                defaultChecked={ind === 0 && "checked"}
                onChange={handleTypeAuto}
              />
              {Object.values(type)[0]}
            </label>
          ))}

          <span>* Микроавтобус/автобус рассчитываются индивидуально</span>
        </div>
        {state.price && state.distance && (
          <>
            <p>
              Расстояние: {state.distance}, Стоимость: {state.price},
            </p>

            <button className='button continue-btn' onClick={handleContinue}>
              Далее
            </button>
          </>
        )}
        {state.from && state.to && (
          <p>
            from: {state.from}, to: {state.to}
          </p>
        )}
      </div>
      <FormMap typeAuto={typeAuto} />
    </div>
  );
};
export default Rout;
