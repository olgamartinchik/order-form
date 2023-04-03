import React from "react";
import Route from "../Route/Route";
import UserData from "../UserData/UserData";
import "./Form.scss";
import { useSelector } from "react-redux";
import { AddFormAction } from "../../redux/actions/FormActions";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

const Form = () => {
  const state = useSelector((state) => state.Form);
  const dispatch = useDispatch();
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  // };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const handleBack = (e) => {
    e.preventDefault();
    console.log("back");
    dispatch(
      AddFormAction({
        isUserData: false,
      })
    );
  };

  return (
    <div className='form-wrapper'>
      <form onSubmit={handleSubmit((data) => console.log(data))} method='POST'>
        <Route register={register} errors={errors} />
        {state.isUserData && (
          <div>
            <UserData register={register} errors={errors} />
            {state.price && <h3>Стоимость трансфера: ~{state.price}б.р.</h3>}
            <div className='button-container'>
              <button
                type='button'
                className='button continue-btn'
                onClick={handleBack}
              >
                Назад
              </button>
              <input type='submit' className='button' />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
export default Form;
