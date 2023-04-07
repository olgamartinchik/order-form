import "./UserData.scss";
import { typeOfPayment } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { AddFormAction } from "../../redux/actions/FormActions";

const UserData = (props) => {
  const dispatch = useDispatch();

  const handleTypePayment = (e) => {
    dispatch(
      AddFormAction({
        payment: e.target.value,
      })
    );
  };

  return (
    <div className='details_container'>
      <div className='user-data_container'>
        <h2>Контактная информация</h2>
        <div className='user-data'>
          <div>
            <label className='label user-data_label'>Имя</label>
            <div className='name-input'>
              <input
                className='input'
                type={"text"}
                placeholder='Иван'
                name='name'
                {...props.register("name")}
              />
            </div>

            <label className='label user-data_label'>E-mail</label>
            <div className='email-input'>
              <input
                className='input'
                type={"email"}
                placeholder='ivanov@gmail.com'
                name='email'
                {...props.register("email")}
              />
            </div>
          </div>
          <div>
            <label className='label user-data_label'>Телефон *</label>
            <div className='phone-input'>
              <input
                className='input'
                type='text'
                placeholder='+375(29)0000000'
                name='phone'
                {...props.register("phone", {
                  required: true,
                  pattern: /\S/,
                })}
              />
              <span className='error'>
                {props.errors.phone ? "Введите телефон" : ""}
              </span>
            </div>

            <label className='label user-data_label'>
              Дата и время поездки
            </label>
            <div className='date-input'>
              <input
                className='input'
                type={"text"}
                placeholder='25.12 в 14:00'
                name='date'
                {...props.register("date")}
              />
            </div>
          </div>
        </div>
        <div className='notes-container'>
          <label className='label user-data_label'>Детали поездки</label>
          <textarea
            className='input notes'
            placeholder='Количество багажа; Hомер рейса / поезда, вагона;  Детское кресло'
            name='notes'
            {...props.register("notes", { min: 0, max: 500 })}
          ></textarea>

          <span className='error'>
            {props.errors.notes ? "Введите до 1000 символов" : ""}
          </span>
        </div>
      </div>
      <div className='payment-type-container'>
        <h2 className='title'>Вид оплаты</h2>
        <div className='type-container'>
          {typeOfPayment.map((type, ind) => (
            <div className='form_radio' key={ind.toString()}>
              <input
                {...props.register("payment")}
                id={`payment-${ind}`}
                type={"radio"}
                name='payment'
                value={Object.keys(type)[0]}
                defaultChecked={ind === 0 && "checked"}
                onChange={handleTypePayment}
              />
              <label htmlFor={`payment-${ind}`} className='label radio-label'>
                {Object.values(type)[0]}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default UserData;
