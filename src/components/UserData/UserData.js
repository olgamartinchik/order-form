import "./UserData.scss";
import { typeOfPayment } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { AddFormAction } from "../../redux/actions/FormActions";

const UserData = () => {
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
            <label>Имя</label>
            <input
              className='input'
              type={"text"}
              placeholder='Иван'
              name='name'
            />

            <label>E-mail</label>
            <input
              className='input'
              type={"email"}
              placeholder='ivanov@gmail.com'
              name='email'
            />
          </div>
          <div>
            <label>Телефон</label>
            <input
              className='input'
              type='text'
              placeholder='+375(29)0000000'
              name='phone'
            />
            <label>Дата и время поездки</label>
            <input
              className='input'
              type={"text"}
              placeholder='25.12 в 14:00'
              name='date'
            />
          </div>
        </div>
        <div className='notes-container'>
          <label>Детали поездки</label>
          <textarea
            className='input notes'
            placeholder='Дата прилета, номер рейса'
          ></textarea>
        </div>
      </div>
      <div className='payment-type-container'>
        <h2>Вид оплаты</h2>
        <div className='type-container'>
          {typeOfPayment.map((type, ind) => (
            <label className='label' key={ind.toString()}>
              <input
                type={"radio"}
                name='payment'
                value={Object.keys(type)[0]}
                defaultChecked={ind === 0 && "checked"}
                onChange={handleTypePayment}
              />
              {Object.values(type)[0]}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
export default UserData;
// https://taxi-aeroport-minsk2.by/spasibo/
// https://taxi-aeroport-minsk2.by/product/oplata-za-poezdku/
