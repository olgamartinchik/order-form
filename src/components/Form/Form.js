import React, { useState } from "react";
import Route from "../Route/Route";
import UserData from "../UserData/UserData";
import "./Form.scss";
import { useSelector } from "react-redux";
import { AddFormAction } from "../../redux/actions/FormActions";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import {
  YOUR_SERVICE_ID,
  YOUR_TEMPLATE_ID,
  YOUR_PUBLIC_KEY,
} from "../../utils/constants";
import Loader from "../Loader/Loader";

const Form = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const formState = useSelector((state) => state.Form);
  const dispatch = useDispatch();

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
  const onSubmit = async (data) => {
    console.log({
      ...data,
      from: `из ${formState.from} в ${formState.to}`,
      detail: `${formState.price}, ${formState.distance}`,
    });
    try {
      setIsSubmit(true);
      const result = await emailjs.send(
        YOUR_SERVICE_ID,
        YOUR_TEMPLATE_ID,
        {
          ...data,
          from: `Из ${formState.from} в ${formState.to}`,
          detail: `${formState.price} б.р., ${formState.distance}`,
        },
        YOUR_PUBLIC_KEY
      );
      if (result) {
        console.log("result", result.text);
        window.location.href = "https://taxi-aeroport-minsk2.by/spasibo/";
        // setIsSubmit(false);
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <div className='form-wrapper'>
      {isSubmit && <Loader />}
      <form
        onSubmit={handleSubmit((data) => {
          onSubmit(data);
        })}
      >
        <Route register={register} errors={errors} />
        {formState.isUserData && (
          <div>
            <UserData register={register} errors={errors} />
            {formState.price && (
              <h3>Стоимость трансфера: ~{formState.price}б.р.</h3>
            )}
            <div className='button-container'>
              <button
                type='button'
                className='button continue-btn'
                onClick={handleBack}
              >
                Назад
              </button>
              <input type='submit' className='button' value={"Заказать"} />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
export default Form;
