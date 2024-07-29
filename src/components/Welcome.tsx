import { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './Layout';
import Dialog from './Dialog';
import { supaClient } from '../utils/supaClient';

export function Welcome() {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [serverError, setServerError] = useState('');
  const [formIsDirty, setFormIsDirty] = useState(false);
  const invalidString = useMemo(() => validateUsername(userName), [userName]);

  return (
    <Dialog
      allowClose={false}
      open={true}
      contents={
        <>
          <h2 className='welcome-header'>
            Welcome to Andson's Project Message Board!
          </h2>
          <p className='text-center'>
            Let's get started by creating a username:
          </p>
          <form
            className='welcome-name-form'
            onSubmit={(event) => {
              event.preventDefault();
              supaClient
                .from('user_profiles')
                .insert([
                  {
                    user_id: user.session?.user.id || '',
                    username: userName,
                  },
                ])
                .then(({ error }) => {
                  if (error) {
                    setServerError(`Username "${userName}" is already taken`);
                  } else {
                    const target = localStorage.getItem('returnPath') || '/';
                    localStorage.removeItem('returnPath');
                    navigate(target);
                  }
                });
            }}
          >
            <input
              name='username'
              placeholder='Username'
              onChange={({ target }) => {
                setUserName(target.value);
                if (!formIsDirty) {
                  setFormIsDirty(true);
                }
                if (serverError) {
                  setServerError('');
                }
              }}
              className='welcome-name-input'
            ></input>
            {formIsDirty && (invalidString || serverError) && (
              <p className='welcome-form-error-message validation-feedback'>
                {serverError || invalidString}
              </p>
            )}
            <p className='text-center'>
              This is the name people will see you as on the Message Board
            </p>
            <button
              className='welcome-form-submit-button'
              type='submit'
              disabled={invalidString != null}
            >
              Submit
            </button>
          </form>
        </>
      }
    />
  );
}

function validateUsername(username: string): string | undefined {
  if (!username) {
    return 'Username is required';
  }
  const regex = /^[a-zA-Z0-9_]+$/;
  if (username.length < 4) {
    return 'Username must be at least 4 characters long';
  }
  if (username.length > 14) {
    return 'Username must be less than 15 characters long';
  }
  if (!regex.test(username)) {
    return 'Username can only contain letters, numbers, and underscores';
  }
  return undefined;
}
