import React from 'react';
import './big-button.component.css';
import Spinner from '../spinner/spinner.component';

const BigButton: React.FC<{
  onClick: () => void;
  title: string;
  isLoading: boolean;
}> = ({ onClick, title, isLoading }) => {
  return (
    <button className="bigbutton" onClick={onClick}>
      {!isLoading ? (
        title
      ) : (
        <div style={{ width: '25px', height: '25px' }}>
          <Spinner />
        </div>
      )}
    </button>
  );
};

export default BigButton;
