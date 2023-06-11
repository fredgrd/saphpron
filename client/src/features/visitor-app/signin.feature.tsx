import React, { useState, useContext } from 'react';
import { isValidEmail } from '../../helpers/email.helper';
import { isValidPassword } from '../../helpers/password.helper';

import AuthInput from '../../components/auth-input/auth-input.component';
import BigButton from '../../components/big-button/big-button.component';
import { UserContext } from '../../context/user.context';
import { ToastContext } from '../../context/tost.context';

const Signin: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const userContext = useContext(UserContext);
  const toastContext = useContext(ToastContext);

  const onSignin = async () => {
    const userService = userContext.service;
    const updateUser = userContext.update;

    if (loading || !userService) return;
    setLoading(true);

    if (
      !email ||
      !password ||
      !isValidEmail(email) ||
      !isValidPassword(password)
    ) {
      setLoading(false);
      toastContext.update({
        isVisible: true,
        message: 'Please fill all the input fields',
      });
      return;
    }

    const { user, error } = await userService.signin(email, password);

    if (error) {
      console.log(error);
      setLoading(false);
      toastContext.update({
        isVisible: true,
        message: `There has been an error signin in: ${error}`,
      });
      return;
    }

    updateUser(user);
  };

  return (
    <div>
      <div style={{ marginBottom: '6px' }}>
        <AuthInput
          value={email}
          onChange={setEmail}
          options={{
            validationHandler: (email) => isValidEmail(email),
            errorMessage: 'Please insert a valid email address',
            placeholder: 'EMAIL',
            type: 'email',
          }}
        />
      </div>
      <div style={{ marginBottom: '6px' }}>
        <AuthInput
          value={password}
          onChange={setPassword}
          options={{
            validationHandler: (password) => isValidPassword(password),
            errorMessage: 'Please add a password with at least 5 characters',
            placeholder: 'PASSWORD',
            type: 'password',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <BigButton title="GO" onClick={onSignin} isLoading={loading} />
      </div>
    </div>
  );
};

export default Signin;
