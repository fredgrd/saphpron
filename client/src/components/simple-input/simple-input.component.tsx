import React from 'react';
import './simple-input.component.css';

interface SimpleInputOptions {
  title?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  isDisabled?: boolean;
}

const SimpleInput: React.FC<{
  value: any;
  onChange: (value: any) => void;
  options?: SimpleInputOptions;
}> = ({ value, onChange, options }) => {
  const { title, placeholder, type, isDisabled } = options || {
    title: '',
    placeholder: '',
    type: 'text',
    isDisabled: false,
  };
  return (
    <div className="simpleinput">
      <label className="simpleinput__label" htmlFor={title}>
        {title}
      </label>
      <input
        id={title}
        className="simpleinput__input"
        onChange={(ev) => onChange(ev.target.value)}
        value={value}
        type={type}
        placeholder={placeholder}
        disabled={isDisabled}
      />
    </div>
  );
};

export default SimpleInput;
