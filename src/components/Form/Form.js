import React, { useRef } from "react";
import Route from "../Route/Route";
import UserData from "../UserData/UserData";
import "./Form.scss";
import { useSelector } from "react-redux";
import { AddFormAction } from "../../redux/actions/FormActions";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";

const Form = () => {
  const formState = useSelector((state) => state.Form);
  const dispatch = useDispatch();
  const form = useRef();
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  // };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  // const sendEmail = (e) => {
  //   e.preventDefault(); // prevents the page from reloading when you hit “Send”

  // emailjs
  //   .sendForm(
  //     "YOUR_SERVICE_ID",
  //     "YOUR_TEMPLATE_ID",
  //     form.current,
  //     "YOUR_PUBLIC_KEY"
  //   )
  //   .then(
  //     (result) => {
  //       console.log("result", result);
  //       // show the user a success message
  //     },
  //     (error) => {
  //       console.log("error", error);
  //       // show the user an error
  //     }
  //   );
  // };

  const handleBack = (e) => {
    e.preventDefault();
    console.log("back");
    dispatch(
      AddFormAction({
        isUserData: false,
      })
    );
  };
  const YOUR_SERVICE_ID = "service_n9g4nii";
  const YOUR_TEMPLATE_ID = "template_m320dst";
  const YOUR_PUBLIC_KEY = "oHr8NKp2rKqUfWhUt";
  return (
    <div className='form-wrapper'>
      <form
        ref={form}
        onSubmit={handleSubmit((data) => {
          console.log("form", form.current);
          console.log(data);

          emailjs
            .send(YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, data, YOUR_PUBLIC_KEY)
            .then(
              (result) => {
                console.log("result", result.text);
                // show the user a success message
              },
              (error) => {
                console.log("error", error.text);
                // show the user an error
              }
            );
        })}
        // method='POST'
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
              <input type='submit' className='button' />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
export default Form;
