import React from 'react';
import Button from './Button'; 

const list = [
  "All", "Live", "Software Engineering", "Java", "Skills", "DSA", "Web Dev",
  "Cricket", "AI", "Communication", "Rohit Sharma", "Namaste JS"
];

const ButtonList = () => {
  return (
    <div className='flex p-2 overflow-x-auto whitespace-nowrap scrollbar-hide'>
      {list.map((item, index) => (
        <Button key={index} name={item} />
      ))}
    </div>
  );
};

export default ButtonList;
