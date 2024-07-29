import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { UserContext } from './Layout';
import UserMenu from './UserMenu';
import Login from './Login';

const NavBar = () => {
  const { session } = useContext(UserContext);

  return (
    <>
      <nav className='nav-bar'>
        <Link className='nav-logo-link' to='/'>
          <FontAwesomeIcon
            id='logo'
            className='nav-logo'
            icon={faHouse}
            size='2x'
          />
        </Link>

        <ul className='nav-right-list'>
          <li className='nav-auth-item'>
            {session?.user ? <UserMenu /> : <Login />}
          </li>
        </ul>
      </nav>
    </>
  );
};

export default NavBar;
