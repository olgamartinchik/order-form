import "./UserData.scss";

const UserData = () => {
  return (
    <div className='details_container'>
      <div className='user-data_container'>
        <div className='user-data'>
          <div>
            <input
              className='input'
              type={"text"}
              placeholder='Имя'
              name='name'
            />
            <input
              className='input'
              type={"email"}
              placeholder='Email'
              name='email'
            />
          </div>
          <div>
            <input
              className='input'
              type='text'
              placeholder='+375(29)0000000'
              name='phone'
            />
            <input
              className='input'
              type={"text"}
              placeholder='Дата поездки'
              name='date'
            />
          </div>
        </div>

        <textarea
          className='notes'
          placeholder='Дата прилета, номер рейса'
        ></textarea>
      </div>
    </div>
  );
};
export default UserData;
