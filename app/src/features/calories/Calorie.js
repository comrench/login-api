import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { selectCalorieById } from './caloriesApiSlice';

const Calorie = ({ calorieId }) => {
  const calorie = useSelector((state) => selectCalorieById(state, calorieId));
  const navigate = useNavigate();

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
        <td className='table__cell calorie__updated'>{calorie.date}</td>

        <td className='table__cell calorie__title'>{calorie.time}</td>
        <td className='table__cell calorie__username'>{calorie.name}</td>
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
