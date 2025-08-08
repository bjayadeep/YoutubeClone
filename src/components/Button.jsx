import React from 'react';

const Button = ({ name }) => {
  return (
    <div>
      <button className='px-4 py-1 m-2 bg-gray-100 rounded-lg text-sm whitespace-nowrap hover:bg-gray-200 transition-colors duration-200'>
        {name}
      </button>
    </div>
  );
};

export default Button;