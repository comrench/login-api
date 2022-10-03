import { useState, useEffect } from 'react';
import {
  useUpdateCalorieMutation,
  useDeleteCalorieMutation,
} from './caloriesApiSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../../hooks/useAuth';

const EditCalorieForm = ({ calorie, users }) => {
  const { isManager, isAdmin } = useAuth();

  const [updateCalorie, { isLoading, isSuccess, isError, error }] =
    useUpdateCalorieMutation();

  const [
    deleteCalorie,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteCalorieMutation();

  const navigate = useNavigate();
  const meals = [
    { key: 'breakfast', value: 'Breakfast' },
    { key: 'bunch', value: 'Lunch' },
    { key: 'dinner', value: 'Dinner' },
  ];

  const [date, setDate] = useState(calorie.date);
  const [time, setTime] = useState(calorie.time);
  const [name, setName] = useState(calorie.name);
  const [quantity, setQuantity] = useState(calorie.quantity);
  const [userId, setUserId] = useState(calorie.user);
  const [meal, setMeal] = useState(calorie.meal);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setDate('');
      setTime('');
      setName('');
      setQuantity('');
      setUserId('');
      setMeal('');
      navigate('/dash/calories');
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onDateChanged = (e) => setDate(e.target.value);
  const onTimeChanged = (e) => setTime(e.target.value);
  const onNameChanged = (e) => setName(e.target.value);
  const onQuantityChanged = (e) => setQuantity(e.target.value);
  const onUserIdChanged = (e) => setUserId(e.target.value);
  const onMealChanged = (e) => setMeal(e.target.value);

  const canSave =
    [date, name, quantity, userId, meal].every(Boolean) && !isLoading;

  const onSaveCalorieClicked = async (e) => {
    if (canSave) {
      await updateCalorie({
        id: calorie.id,
        user: userId,
        date,
        time,
        name,
        meal,
        quantity: parseFloat(quantity),
      });
    }
  };

  const onDeleteCalorieClicked = async () => {
    await deleteCalorie({ id: calorie.id });
  };

  const created = new Date(calorie.createdAt).toLocaleString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
  const updated = new Date(calorie.updatedAt).toLocaleString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  const options = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {user.username}
      </option>
    );
  });

  const mealOptions = meals.map((meal) => {
    return (
      <option key={meal.key} value={meal.value}>
        {meal.value}
      </option>
    );
  });

  const errClass = isError || isDelError ? 'errmsg' : 'offscreen';
  const validDateClass = !date ? 'form__input--incomplete' : '';
  const validTimeClass = !date ? 'form__input--incomplete' : '';
  const validMealClass = !meal ? 'form__input--incomplete' : '';
  const validNameClass = !name ? 'form__input--incomplete' : '';
  const validQuantityClass = !quantity ? 'form__input--incomplete' : '';

  const errContent = (error?.data?.message || delerror?.data?.message) ?? '';

  let deleteButton = null;
  if (isManager || isAdmin) {
    deleteButton = (
      <button
        className='icon-button'
        title='Delete'
        onClick={onDeleteCalorieClicked}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    );
  }

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className='form' onSubmit={(e) => e.preventDefault()}>
        <div className='form__title-row'>
          <h2>Edit Calorie #{calorie.ticket}</h2>
          <div className='form__action-buttons'>
            <button
              className='icon-button'
              title='Save'
              onClick={onSaveCalorieClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            {deleteButton}
          </div>
        </div>

        <label className='form__label' htmlFor='meal'>
          Meal Type:
        </label>
        <select
          id='meal'
          name='meal'
          className={`form__select ${validMealClass}`}
          // size='3'
          value={meal}
          onChange={onMealChanged}
        >
          {mealOptions}
        </select>

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
          type='text'
          autoComplete='off'
          value={quantity}
          onChange={onQuantityChanged}
        />

        <div className='form__row'>
          {isAdmin && (
            <div className='form__divider'>
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
            </div>
          )}
          <div className='form__divider'>
            <p className='form__created'>
              Created:
              <br />
              {created}
            </p>
            <p className='form__updated'>
              Updated:
              <br />
              {updated}
            </p>
          </div>
        </div>
      </form>
    </>
  );

  return content;
};

export default EditCalorieForm;
