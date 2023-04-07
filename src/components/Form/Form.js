import React, { useState } from "react";
import Route from "../Route/Route";
import UserData from "../UserData/UserData";
import "./Form.scss";
import { useSelector } from "react-redux";
import {
  AddFormAction,
  DeleteFormAction,
} from "../../redux/actions/FormActions";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import {
  YOUR_SERVICE_ID,
  YOUR_TEMPLATE_ID,
  YOUR_PUBLIC_KEY,
  errorMessage,
} from "../../utils/constants";
import Loader from "../Loader/Loader";
import Notification from "../Notification/Notification";

const Form = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  const formState = useSelector((state) => state.Form);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const handleBack = (e) => {
    // e.preventDefault();
    dispatch(
      AddFormAction({
        isUserData: false,
      })
    );
  };
  const onSubmit = async (data) => {
    try {
      setIsSubmitted(true);

      const result = await emailjs.send(
        YOUR_SERVICE_ID,
        YOUR_TEMPLATE_ID,
        {
          ...data,
          payment: formState.payment,
          auto: formState.auto,
          from: `Из ${formState.from} в ${formState.to}`,
          detail: `${formState.price} б.р., ${formState.distance}`,
        },
        YOUR_PUBLIC_KEY
      );
      if (result) {
        window.location.href = "https://taxi-aeroport-minsk2.by/spasibo/";
        // window.location.replace("https://taxi-aeroport-minsk2.by/spasibo/");

        resetForm();
      }
    } catch (e) {
      console.log("error", e);
      setIsError(true);
      resetForm();
      setTimeout(() => {
        setIsError(false);
      }, 7000);
    }
  };
  const resetForm = () => {
    dispatch(DeleteFormAction());
    reset();
    setIsSubmitted(false);
  };

  return (
    <div className='form-wrapper'>
      {isError && <Notification errorMessage={errorMessage} />}

      {isSubmitted && <Loader />}
      <form
        onSubmit={handleSubmit(async (data) => {
          await onSubmit(data);
        })}
      >
        <Route register={register} errors={errors} />
        {formState.isUserData && (
          <div>
            <UserData register={register} errors={errors} />
            {formState.price && (
              <h3 className='text-center'>
                Стоимость трансфера:{" "}
                <span className='nowrap'>~{formState.price} б.р.</span>
              </h3>
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
