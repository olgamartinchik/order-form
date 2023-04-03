import React, { useState } from "react";
import "./Rout.scss";
import MapLayout from "../FormMap/MapLayout";
import { typesAuto } from "../../utils/constants";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AddFormAction } from "../../redux/actions/FormActions";
import { calculateDistance } from "../../utils/utils";

const Route = (props) => {
  const [typeAuto, setTypeAuto] = useState("standard");

  const state = useSelector((state) => state.Form);
  const dispatch = useDispatch();

  const handleContinue = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("errors", props.errors);
    dispatch(
      AddFormAction({
        isUserData: true,
      })
    );
    console.log("state");
  };
  const handleTypeAuto = (e) => {
    setTypeAuto((typeAuto) => (typeAuto = e.target.value));
    if (parseInt(state.distance)) {
      const price = calculateDistance(parseInt(state.distance), e.target.value);
      const balloon = document.querySelector(".ballon-price");
      balloon.innerText = price;
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
    <div className={state.isUserData ? "hidden" : ""}>
      <div className={"form-container "}>
        <MapLayout
          typeAuto={typeAuto}
          register={props.register}
          errors={props.errors}
        />
        <div className={"rout-container"}>
          <h2>Тип транспорта</h2>
          <div className='auto-type'>
            {typesAuto.map((type, ind) => (
              <label className='label' key={ind.toString()}>
                <input
                  type={"radio"}
                  name='auto'
                  {...props.register("auto")}
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
              <p className='price_detail'>
                {props.errors.from || props.errors.to
                  ? "* Уточните маршрут"
                  : "* Стоимость уточняйте у оператора"}
              </p>
              {/* {(props.errors.from || props.errors.to) && (
                <span className='error'>Уточните маршрут</span>
              )} */}
              <button
                type='button'
                className='button continue-btn'
                onClick={handleContinue}
                disabled={props.errors.from || props.errors.to}
              >
                Далее
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Route;
