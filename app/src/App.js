import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Public from './components/Public';
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout';
import Welcome from './features/auth/Welcome';
import CaloriesList from './features/calories/CaloriesList';
import UsersList from './features/users/UsersList';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Public />}></Route>
        <Route path='login' element={<Login />}></Route>

        <Route path='dash' element={<DashLayout />}>
          <Route index element={<Welcome />} />

          <Route path='calories'>
            <Route index element={<CaloriesList />} />
          </Route>

          <Route path='users'>
            <Route index element={<UsersList />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
