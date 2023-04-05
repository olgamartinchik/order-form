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
      if (balloon) {
        balloon.innerText = price;
      }

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
    <div className={"form-container " + state.isUserData ? "hidden" : ""}>
      <MapLayout
        typeAuto={typeAuto}
        register={props.register}
        errors={props.errors}
      />
      <div className={"rout-container"}>
        <h2 className='title'>Тип транспорта</h2>
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
          <div className='continue_container'>
            <h3>Стоимость трансфера: ~{state.price}б.р.</h3>

            <p className='subtitle'>
              {props.errors.from || props.errors.to
                ? "* Уточните маршрут"
                : "* Стоимость уточняйте у оператора"}
            </p>
            <p className='subtitle price_detail'>
              * Стоимость международного трансфера просчитывается индивидуально
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
          </div>
        )}
      </div>
    </div>
  );
};
export default Route;
