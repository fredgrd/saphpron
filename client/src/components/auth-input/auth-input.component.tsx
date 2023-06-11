import React, { useState } from 'react';
import './auth-input.component.css';

interface AuthInputOptions {
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  validationHandler?: (value: string) => boolean;
  errorMessage?: string;
}

const AuthInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options?: AuthInputOptions;
}> = ({ value, onChange, options }) => {
  const [showError, setShowError] = useState<boolean>(false);

  const _onBlur = () => {
    const handler = options?.validationHandler;

    if (!handler) return;

    const isValid = handler(value);
    setShowError(!isValid);
  };

  return (
    <div className="auth-input">
      <input
        className={`auth-input__input ${
          showError && 'auth-input__input-error'
        }`}
        type={options?.type}
        placeholder={options?.placeholder}
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
        onBlur={_onBlur}
      />
      <div className="auth-input__message">
        {options?.errorMessage && showError ? options.errorMessage : ''}
      </div>
    </div>
  );
};

export default AuthInput;
