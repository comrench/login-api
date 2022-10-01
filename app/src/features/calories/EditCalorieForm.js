import { useState, useEffect } from 'react';
import {
  useUpdateCalorieMutation,
  useDeleteCalorieMutation,
} from './caloriesApiSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons';

const EditCalorieForm = ({ calorie, users }) => {
  const [updateCalorie, { isLoading, isSuccess, isError, error }] =
    useUpdateCalorieMutation();

  const [
    deleteCalorie,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteCalorieMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState(calorie.title);
  const [text, setText] = useState(calorie.text);
  const [completed, setCompleted] = useState(calorie.completed);
  const [userId, setUserId] = useState(calorie.user);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle('');
      setText('');
      setUserId('');
      navigate('/dash/calories');
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onCompletedChanged = (e) => setCompleted((prev) => !prev);
  const onUserIdChanged = (e) => setUserId(e.target.value);

  const canSave = [title, text, userId].every(Boolean) && !isLoading;

  const onSaveCalorieClicked = async (e) => {
    if (canSave) {
      await updateCalorie({
        id: calorie.id,
        user: userId,
        title,
        text,
        completed,
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
        {' '}
        {user.username}
      </option>
    );
  });

  const errClass = isError || isDelError ? 'errmsg' : 'offscreen';
  const validTitleClass = !title ? 'form__input--incomplete' : '';
  const validTextClass = !text ? 'form__input--incomplete' : '';

  const errContent = (error?.data?.message || delerror?.data?.message) ?? '';

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
            <button
              className='icon-button'
              title='Delete'
              onClick={onDeleteCalorieClicked}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>
        <label className='form__label' htmlFor='calorie-title'>
          Title:
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          id='calorie-title'
          name='title'
          type='text'
          autoComplete='off'
          value={title}
          onChange={onTitleChanged}
        />

        <label className='form__label' htmlFor='calorie-text'>
          Text:
        </label>
        <textarea
          className={`form__input form__input--text ${validTextClass}`}
          id='calorie-text'
          name='text'
          value={text}
          onChange={onTextChanged}
        />
        <div className='form__row'>
          <div className='form__divider'>
            <label
              className='form__label form__checkbox-container'
              htmlFor='calorie-completed'
            >
              WORK COMPLETE:
              <input
                className='form__checkbox'
                id='calorie-completed'
                name='completed'
                type='checkbox'
                checked={completed}
                onChange={onCompletedChanged}
              />
            </label>

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
