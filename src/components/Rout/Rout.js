import React from "react";
import "./Rout.scss";
import { FormMap } from "../FormMap/FormMap";

export class Rout extends React.Component {
  render() {
    return (
      <div className={"form-container"}>
        <div className={"rout-container"}>
          <h2>Постройте маршрут</h2>
          <div className='input-container'>
            <div>
              <label for='from'>Откуда</label>
              <input id='from' type={"text"} placeholder={"Откуда"} />
            </div>
            <div>
              <label for='to'>Куда</label>
              <input id='to' type={"text"} placeholder={"Куда"} />
            </div>
          </div>
          <button className='continue-btn'>Далее</button>
        </div>
        <FormMap />
      </div>
    );
  }
}
