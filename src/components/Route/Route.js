import React, { useState } from "react";
import "./Rout.scss";
import MapLayout from "../FormMap/MapLayout";
import { typesAuto } from "../../utils/constants";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AddFormAction } from "../../redux/actions/FormActions";
import { calculateDistance } from "../../utils/utils";
import UserData from "../UserData/UserData";

const Route = () => {
  const [typeAuto, setTypeAuto] = useState("standard");

  const state = useSelector((state) => state.Form);
  const dispatch = useDispatch();

  const handleContinue = (e) => {
    e.preventDefault();
    console.log("state");
  };
  const handleTypeAuto = (e) => {
    console.log("e.target", e.target.value);
    console.log("state store", parseInt(state.distance));

    setTypeAuto((typeAuto) => (typeAuto = e.target.value));
    if (parseInt(state.distance)) {
      const price = calculateDistance(parseInt(state.distance), e.target.value);
      dispatch(
        AddFormAction({
          price,
          auto: e.target.value,
        })
      );
    }
    // console.log("typeAuto", typeAuto);
  };

  return (
    <div>
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
          </div>

          {state.price && state.distance && (
            <>
              <p>
                Расстояние: {state.distance}, Стоимость: ~{state.price} б.р.,
                Длительность: ~{state.time}
              </p>
              <p className='price_detail'>* Стоимость уточняйте у оператора</p>
              <button className='button continue-btn' onClick={handleContinue}>
                Далее
              </button>
            </>
          )}
        </div>

        <MapLayout typeAuto={typeAuto} />
      </div>
      <UserData />
    </div>
  );
};
export default Route;
