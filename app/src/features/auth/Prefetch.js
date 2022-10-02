import { store } from '../../app/store';
import { caloriesApiSlice } from '../calories/caloriesApiSlice';
import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {
  useEffect(() => {
    const calories = store.dispatch(
      caloriesApiSlice.endpoints.getCalories.initiate()
    );
    const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());

    return () => {
      calories.unsubscribe();
      users.unsubscribe();
    };
  }, []);

  return <Outlet />;
};

export default Prefetch;
