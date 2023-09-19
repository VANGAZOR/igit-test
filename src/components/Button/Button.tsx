import React from 'react';

interface ButtonProps {
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <button className=' px-2 py-2 bg-blue-500 text-white rounded' onClick={onClick}>
      Нарисовать линию
    </button>
  );
};

export default Button;
