import { useContext } from 'react';
import { UserContext } from './Layout';
import { supaClient } from '../utils/supaClient';

const UserMenu = () => {
  const { profile } = useContext(UserContext);
  const handleLogout = async () => {
    await supaClient.auth.signOut();
  };

  return (
    <>
      <div className='flex flex-col'>
        <h2>Welcome, {profile?.username || 'friend'}.</h2>
        <button className='user-menu-logout-button' onClick={handleLogout}>
          Logout
        </button>
      </div>
    </>
  );
};

export default UserMenu;
