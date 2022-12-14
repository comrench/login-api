import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Public from './components/Public';
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout';
import Welcome from './features/auth/Welcome';
import CaloriesList from './features/calories/CaloriesList';
import UsersList from './features/users/UsersList';
import EditUser from './features/users/EditUser';
import NewUserForm from './features/users/NewUserForm';
import EditCalorie from './features/calories/EditCalorie';
import NewCalorie from './features/calories/NewCalorie';
import Prefetch from './features/auth/Prefetch';
import PersistLogin from './features/auth/PersistLogin';
import RequireAuth from './features/auth/RequireAuth';
import { ROLES } from './config/roles';
import UserReports from './features/users/UserReports';
import InviteFriend from './features/users/InviteFriend';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Public />}></Route>
        <Route path='login' element={<Login />}></Route>

        {/* Protected routes */}
        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            <Route element={<Prefetch />}>
              <Route path='dash' element={<DashLayout />}>
                <Route index element={<Welcome />} />

                <Route
                  element={
                    <RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />
                  }
                >
                  <Route path='users'>
                    <Route index element={<UsersList />} />
                    <Route path=':id' element={<EditUser />} />
                    <Route path='new' element={<NewUserForm />} />
                    <Route path='reports' element={<UserReports />} />
                  </Route>
                </Route>

                <Route path='calories'>
                  <Route index element={<CaloriesList />} />
                  <Route path=':id' element={<EditCalorie />} />
                  <Route path='new' element={<NewCalorie />} />
                </Route>

                <Route path='invite'>
                  <Route index element={<InviteFriend />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
