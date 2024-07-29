import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import { createContext } from 'react';
import { SupashipUserInfo, useSession } from '../hooks/useSession';

export const UserContext = createContext<SupashipUserInfo>({
  session: null,
  profile: null,
});

const Layout = () => {
  const supashipUserInfo = useSession();

  return (
    <>
      <UserContext.Provider value={supashipUserInfo}>
        <NavBar />
        <Outlet />
      </UserContext.Provider>
    </>
  );
};

export default Layout;
