import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useState } from 'react';
import { supaClient } from '../utils/supaClient';
import Dialog from './Dialog';

const Login = () => {
  const [showModal, setShowModal] = useState(false);
  const [authMode, setAuthMode] = useState<'sign_in' | 'sign_up'>('sign_in');

  const handleLoginBtn = () => {
    setShowModal(true);
    setAuthMode('sign_in');
  };

  const handleSignUpBtn = () => {
    setShowModal(true);
    setAuthMode('sign_up');
  };

  return (
    <>
      <div className='flex m-4 place-items-center'>
        <button onClick={handleLoginBtn}>Login</button>{' '}
        <span className='p-2'> or </span>
        <button onClick={handleSignUpBtn}>Sign Up</button>
      </div>

      <Dialog
        open={showModal}
        dialogStateChange={(open) => setShowModal(open)}
        contents={
          <>
            {
              <Auth
                supabaseClient={supaClient}
                providers={['google']}
                view={authMode}
                appearance={{
                  theme: ThemeSupa,
                  className: {
                    container: 'login-form-container',
                    label: 'login-form-label',
                    button: 'login-form-button',
                    input: 'login-form-input',
                  },
                }}
              />
            }
          </>
        }
      />
    </>
  );
};

export default Login;
