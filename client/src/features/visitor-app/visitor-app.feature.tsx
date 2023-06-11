import React, { useContext, useState } from 'react';
import { isValidEmail } from '../../helpers/email.helper';
import { isValidPassword } from '../../helpers/password.helper';
import './visitor-app.feature.css';

import Logo from '../../assets/logo.png';
import SmallButton from '../../components/small-button/small-button.component';
import Signin from './signin.feature';
import Signup from './signup.feature';

enum AuthMode {
  SIGNIN = 'signin',
  SIGNUP = 'signup',
}

const VisitorApp: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>(AuthMode.SIGNIN);

  const onSwitchMode = (mode: AuthMode) => {
    setMode(mode);
  };

  return (
    <div className="visitorapp">
      <div className="visitorapp__card__container">
        <div className="visitorapp__mode-selector">
          <SmallButton
            title="SIGN IN"
            onClick={() => onSwitchMode(AuthMode.SIGNIN)}
            isSelected={mode === 'signin'}
            options={{ selectedColor: '#FCCE61' }}
          />

          <SmallButton
            title="SIGN UP"
            onClick={() => onSwitchMode(AuthMode.SIGNUP)}
            isSelected={mode === 'signup'}
            options={{ selectedColor: '#FCCE61' }}
          />
        </div>

        <div className="visitorapp__card">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img className="visitorapp__logo" src={Logo} />
          </div>
          {mode === 'signin' ? <Signin /> : <Signup />}
        </div>
      </div>
    </div>
  );
};

export default VisitorApp;
