import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddNewCalorieMutation } from './caloriesApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../../hooks/useAuth';

const NewCalorieForm = ({ users }) => {
  const { username, isAdmin } = useAuth();

  const [addNewCalorie, { isLoading, isSuccess, isError, error }] =
    useAddNewCalorieMutation();

  const navigate = useNavigate();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(
    new Date().toISOString().split('T')[1].split('.')[0]
  );
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [userId, setUserId] = useState(
    users.filter((user) => user.username === username)[0].id
  );

  console.log(time);

  useEffect(() => {
    if (isSuccess) {
      setDate('');
      setTime('');
      setName('');
      setQuantity('');
      setUserId('');
      navigate('/dash/calories');
    }
  }, [isSuccess, navigate]);

  const onDateChanged = (e) => setDate(e.target.value);
  const onTimeChanged = (e) => setTime(e.target.value);
  const onNameChanged = (e) => setName(e.target.value);
  const onQuantityChanged = (e) => setQuantity(e.target.value);
  const onUserIdChanged = (e) => setUserId(e.target.value);

  const canSave = [date, name, quantity, userId].every(Boolean) && !isLoading;

  const onSaveCalorieClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewCalorie({
        user: userId,
        date,
        time,
        name,
        quantity: parseFloat(quantity),
      });
    }
  };

  const options = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {user.username}
      </option>
    );
  });

  const errClass = isError ? 'errmsg' : 'offscreen';
  const validDateClass = !date ? 'form__input--incomplete' : '';
  const validTimeClass = !date ? 'form__input--incomplete' : '';
  const validNameClass = !name ? 'form__input--incomplete' : '';
  const validQuantityClass = !quantity ? 'form__input--incomplete' : '';

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className='form' onSubmit={onSaveCalorieClicked}>
        <div className='form__title-row'>
          <h2>New Calorie</h2>
          <div className='form__action-buttons'>
            <button className='icon-button' title='Save' disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>

        <label className='form__label' htmlFor='calorie-date'>
          Date:
        </label>
        <input
          className={`form__input ${validDateClass}`}
          id='calorie-date'
          name='date'
          type='date'
          max={new Date().toISOString().split('T')[0]}
          autoComplete='off'
          value={date}
          onChange={onDateChanged}
        />

        <label className='form__label' htmlFor='calorie-date'>
          Time:
        </label>
        <input
          className={`form__input ${validTimeClass}`}
          type='time'
          id='time'
          name='time'
          value={time}
          onChange={onTimeChanged}
          required
        />

        <label className='form__label' htmlFor='calorie-name'>
          Name:
        </label>
        <input
          className={`form__input ${validNameClass}`}
          id='calorie-name'
          name='name'
          type='text'
          autoComplete='off'
          value={name}
          onChange={onNameChanged}
        />

        <label className='form__label' htmlFor='calorie-quantity'>
          Quantity:
        </label>
        <input
          className={`form__input ${validQuantityClass}`}
          id='calorie-quantity'
          name='quantity'
          type='number'
          autoComplete='off'
          value={quantity}
          onChange={onQuantityChanged}
        />

        {isAdmin && (
          <>
            <label
              className='form__label form__checkbox-container'
              htmlFor='calorie-username'
            >
              ASSIGNED TO:
            </label>
            <select
              id='calorie-username'
              name='username'
              className='form__select'
              value={userId}
              onChange={onUserIdChanged}
            >
              {options}
            </select>
          </>
        )}
      </form>
    </>
  );

  return content;
};

export default NewCalorieForm;
