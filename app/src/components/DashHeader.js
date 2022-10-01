import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileCirclePlus,
  faFilePen,
  faUserGear,
  faUserPlus,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useSendLogoutMutation } from '../features/auth/authApiSlice';
import useAuth from '../hooks/useAuth';

const DASH_REGEX = /~\/dash(\/)?$/;
const CALORIES_REGEX = /~\/dash\/calories(\/)?$/;
const USERS_REGEX = /~\/dash\/users(\/)?$/;

const DashHeader = () => {
  const { isManager, isAdmin } = useAuth();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess, navigate]);

  const onNewCalorieClicked = () => navigate('/dash/calories/new');
  const onNewUserClicked = () => navigate('/dash/users/new');
  const onCaloriesClicked = () => navigate('/dash/calories');
  const onUsersClicked = () => navigate('/dash/users');

  const onLogoutClicked = () => sendLogout();

  let dashClass = null;
  if (
    !DASH_REGEX.test(pathname) &&
    !CALORIES_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)
  ) {
    dashClass = 'dash-header__container--small';
  }

  let newCalorieButton = null;
  if (CALORIES_REGEX.test(pathname)) {
    newCalorieButton = (
      <button
        className='icon-button'
        title='New Calorie'
        onClick={onNewCalorieClicked}
      >
        <FontAwesomeIcon icon={faFileCirclePlus} />
      </button>
    );
  }

  let newUserButton = null;
  if (USERS_REGEX.test(pathname)) {
    newUserButton = (
      <button
        className='icon-button'
        title='New User'
        onClick={onNewUserClicked}
      >
        <FontAwesomeIcon icon={faUserPlus} />
      </button>
    );
  }

  let userButton = null;
  if (isManager || isAdmin) {
    if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) {
      userButton = (
        <button className='icon-button' title='Users' onClick={onUsersClicked}>
          <FontAwesomeIcon icon={faUserGear} />
        </button>
      );
    }
  }

  let caloriesButton = null;
  if (!CALORIES_REGEX.test(pathname) && pathname.includes('/dash')) {
    caloriesButton = (
      <button
        className='icon-button'
        title='Calories'
        onClick={onCaloriesClicked}
      >
        <FontAwesomeIcon icon={faFilePen} />
      </button>
    );
  }

  const logoutButton = (
    <button className='icon-button' title='Logout' onClick={onLogoutClicked}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );

  const errClass = isError ? 'errmsg' : 'offscreen';

  let buttonContent;
  if (isLoading) {
    buttonContent = <p>Logging Out...</p>;
  } else {
    buttonContent = (
      <>
        {newCalorieButton}
        {newUserButton}
        {caloriesButton}
        {userButton}
        {logoutButton}
      </>
    );
  }

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <header className='dash-header'>
        <div className={`dash-header__container ${dashClass}`}>
          <Link to='/dash'>
            <h1 className='dash-header__title'>CalorieApp</h1>
          </Link>
        </div>
        <nav className='dash-header__nav'>{buttonContent}</nav>
      </header>
    </>
  );
  return content;
};

export default DashHeader;
