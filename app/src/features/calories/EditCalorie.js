import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCalorieById } from './caloriesApiSlice';
import { selectAllUsers } from '../users/usersApiSlice';
import EditCalorieForm from './EditCalorieForm';

const EditCalorie = () => {
  const { id } = useParams();

  const calorie = useSelector((state) => selectCalorieById(state, id));
  const users = useSelector(selectAllUsers);

  const content =
    calorie && users ? (
      <EditCalorieForm calorie={calorie} users={users} />
    ) : (
      <p>Loading...</p>
    );

  return content;
};

export default EditCalorie;
