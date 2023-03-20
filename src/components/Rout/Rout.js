import React from "react";
import "./Rout.scss";
import { FormMap } from "../FormMap/FormMap";

export class Rout extends React.Component {
  constructor() {
    super();
    this.handleContinue = this.handleContinue.bind(this);
    this.handleInputFrom = this.handleInputFrom.bind(this);
    this.handleInputTo = this.handleInputTo.bind(this);
    this.state = {
      from: "",
      to: "",
    };
  }
  handleInputFrom(e) {
    this.setState({
      from: e.target.value,
    });
  }
  handleInputTo(e) {
    this.setState({
      to: e.target.value,
    });
  }
  handleContinue(e) {
    e.preventDefault();
    console.log("state", this.state);
  }
  render() {
    return (
      <div className={"form-container"}>
        <div className={"rout-container"}>
          <h2>Постройте маршрут</h2>
          <div className='input-container'>
            <label>
              Откуда
              <input
                name='from'
                type='text'
                placeholder={"Откуда"}
                required
                onChange={this.handleInputFrom}
              />
            </label>

            <label>
              Куда
              <input
                name='to'
                type='text'
                placeholder={"Куда"}
                required
                onChange={this.handleInputTo}
              />
            </label>
          </div>
          <button className='button continue-btn' onClick={this.handleContinue}>
            Далее
          </button>
        </div>
        <FormMap />
      </div>
    );
  }
}
