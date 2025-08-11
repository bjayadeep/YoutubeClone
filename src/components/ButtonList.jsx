import React from 'react';
import Button from './Button';
import { useNavigate } from 'react-router-dom'; 

const list = [
  "All", "Live", "Software Engineering", "Java", "Skills", "DSA", "Web Dev",
  "Cricket", "AI", "Communication", "Rohit Sharma", "Namaste JS", "GitHub"
];

const ButtonList = () => {
  const navigate = useNavigate(); 

  const handleButtonClick = (name) => {
    if (name === "Live") {
      navigate(`/results?search_query=live&event_type=live`);
    } else {
      // navigate(`/results?search_query=${encodeURIComponent(name)}`);
    }
  };

  return (
    <div className='flex p-2 overflow-x-auto whitespace-nowrap scrollbar-hide'>
      {list.map((item, index) => (
        <Button key={index} name={item} onClick={() => handleButtonClick(item)} />
      ))}
    </div>
  );
};

export default ButtonList;
