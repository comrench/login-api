import { useSelector } from 'react-redux';
import { selectAllUsers } from '../users/usersApiSlice';
import NewCalorieForm from './NewCalorieForm';

const NewCalorie = () => {
  const users = useSelector(selectAllUsers);

  const content = users ? <NewCalorieForm users={users} /> : <p>Loading...</p>;

  return content;
};

export default NewCalorie;
