import React from "react";
import { Rout } from "../Rout/Rout";
import "./Form.scss";
export class Form extends React.Component {
  handleSubmit(e) {
    e.preventDefault();
    console.log("submit");
  }
  render() {
    return (
      <div className='form-wrapper'>
        <form onSubmit={this.handleSubmit}>
          <Rout />
          <input type='submit' className='button' />
        </form>
      </div>
    );
  }
}
