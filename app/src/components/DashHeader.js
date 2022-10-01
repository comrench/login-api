import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useSendLogoutMutation } from '../features/auth/authApiSlice';

const DASH_REGEX = /~\/dash(\/)?$/;
const CALORIES_REGEX = /~\/dash\/calories(\/)?$/;
const USERS_REGEX = /~\/dash\/users(\/)?$/;

const DashHeader = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess, navigate]);

  const onLogoutClicked = () => sendLogout();

  if (isLoading) return <p>Logging out...</p>;

  if (isError) return <p>Error: {error.data?.message}</p>;

  let dashClass = null;
  if (
    !DASH_REGEX.test(pathname) &&
    !CALORIES_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)
  ) {
    dashClass = 'dash-header__container--small';
  }

  const logoutButton = (
    <button className='icon-button' title='Logout' onClick={onLogoutClicked}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );

  const content = (
    <header className='dash-header'>
      <div className={`dash-header__container ${dashClass}`}>
        <Link to='/dash'>
          <h1 className='dash-header__title'>CalorieApp</h1>
        </Link>
      </div>
      <nav className='dash-header__nav'>
        {logoutButton}
        {/** add nav buttons later */}
      </nav>
    </header>
  );
  return content;
};

export default DashHeader;
