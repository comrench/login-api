import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { selectCalorieById } from './caloriesApiSlice';
import { selectUserById } from '../users/usersApiSlice';

const Calorie = ({ calorieId, dateQtyMap, isAdmin }) => {
  const calorie = useSelector((state) => selectCalorieById(state, calorieId));
  const user = useSelector((state) => selectUserById(state, calorie?.user));
  const limit = user?.limit;

  const navigate = useNavigate();

  const limitExceeded = dateQtyMap.get(calorie?.date) > limit;

  if (calorie) {
    const created = new Date(calorie.createdAt).toLocaleString('en-US', {
      day: 'numeric',
      month: 'long',
    });

    const updated = new Date(calorie.updatedAt).toLocaleString('en-US', {
      day: 'numeric',
      month: 'long',
    });

    const handleEdit = () => navigate(`/dash/calories/${calorieId}`);

    return (
      <tr className='table__row'>
        <td className='table__cell calorie__username'>{calorie.username}</td>
        <td className='table__cell calorie__created'>{calorie.name}</td>
        <td className='table__cell calorie__updated'>
          {calorie.date} {calorie.time}
        </td>

        <td className='table__cell calorie__title'>{calorie.quantity}</td>
        <td className='table__cell calorie__username'>
          {isAdmin ? 'NA' : limitExceeded ? 'Exceeded' : 'In limit'}
        </td>
        {/* <td className='table__cell calorie__username'>{calorie.quantity}</td> */}
        <td className='table__cell'>
          <button className='icon-button table__button' onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  } else return null;
};

export default Calorie;
