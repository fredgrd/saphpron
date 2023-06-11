import React from 'react';
import './small-button.component.css';

const SmallButton: React.FC<{
  onClick: () => void;
  title: string;
  isSelected: boolean;
  options?: {
    selectedColor?: string;
  };
}> = ({ onClick, title, isSelected, options }) => {
  const { selectedColor } = options || {
    selectedColor: '#EFEFEF',
  };

  return (
    <button
      className="smallbutton"
      style={{ backgroundColor: isSelected ? selectedColor : undefined }}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default SmallButton;
