import { store } from '../../app/store';
import { caloriesApiSlice } from '../calories/caloriesApiSlice';
import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {
  useEffect(() => {
    console.log('subscribing');
    const calories = store.dispatch(
      caloriesApiSlice.endpoints.getCalories.initiate()
    );
    const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());

    return () => {
      console.log('unsubscribing');
      calories.unsubscribe();
      users.unsubscribe();
    };
  }, []);

  return <Outlet />;
};

export default Prefetch;
