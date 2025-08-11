import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu } from "../utils/appSlice"; // For toggling sidebar
import { cacheResults } from "../utils/searchSlice"; // For search suggestions caching
import { Link, useNavigate } from "react-router-dom"; // For navigation (YouTube logo, search results)


const YOUTUBE_SUGGESTION_API = "/api/suggestions&q=";

const Head = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchCache = useSelector((store) => store.search);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
   
    if (searchQuery && searchCache[searchQuery]) {
      setSuggestions(searchCache[searchQuery]);
      return; 
    }

    const timer = setTimeout(() => {
      if (searchQuery) {
        getSearchSuggestions(); 
      } else {
        setSuggestions([]); 
      }
    }, 200);

   
    return () => clearTimeout(timer);
  }, [searchQuery, searchCache]); 

  const getSearchSuggestions = async () => {
    try {
      const response = await fetch(YOUTUBE_SUGGESTION_API + encodeURIComponent(searchQuery));
      const text = await response.text(); 

      const match = text.match(/h\((.*)\)/s);

      if (match && match[1]) {
        const jsonString = match[1]; 

        try {
          const parsedArray = JSON.parse(jsonString);

          if (Array.isArray(parsedArray) && Array.isArray(parsedArray[1])) {
            
            const extractedSuggestions = parsedArray[1].map(item => item[0]);
            setSuggestions(extractedSuggestions); 

            dispatch(cacheResults({ [searchQuery]: extractedSuggestions }));

          } else {
            setSuggestions([]);
          }
        } catch (parseError) {
          setSuggestions([]); 
          console.error("JSON parsing failed for string:", jsonString, "Error:", parseError);
        }
      } else {
        setSuggestions([]);
        console.error("Could not extract main array content from response text using regex.", text);
      }
    } catch (error) {
      setSuggestions([]); 
      console.error("Failed to fetch search suggestions (Network or unexpected error):", error);
    }
  };

  const toggleMenuHandler = () => {
    dispatch(toggleMenu());
  };

  const handleSearchSubmit = (queryToSearch) => {
    setShowSuggestions(false); 
    setSearchQuery(queryToSearch);
    navigate(`/results?search_query=${encodeURIComponent(queryToSearch)}`);
  };

  return (
    <div className="flex justify-between items-center p-4 shadow-lg bg-white rounded-none fixed top-0 left-0 right-0 w-full z-[1000]">
      <div className="flex items-center">
        <img
          onClick={toggleMenuHandler} 
          alt="menu"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/285px-Hamburger_icon.svg.png"
        />
        <Link to="/"> 
          <img
            className="h-8 ml-4 cursor-pointer"
            alt="youtube-logo"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Logo_of_YouTube_%282015-2017%29.svg/2560px-Logo_of_YouTube_%282015-2017%29.svg.png"
          />
        </Link>
      </div>

      {/* Middle*/}
      <div className="flex items-center w-1/2 relative">
        <input
          className="w-full p-2 border border-gray-400 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)} 
          onBlur={() => setTimeout(() => setShowSuggestions(false), 500)}

          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearchSubmit(searchQuery);
            }
          }}
        />
        <button
          className="border border-gray-400 p-2 rounded-r-full bg-gray-100 px-6 text-gray-700 hover:bg-gray-200"
          onClick={() => handleSearchSubmit(searchQuery)} 
        >
          🔍
        </button>

        {/* Search */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <ul className="max-h-80 overflow-y-auto">
              {suggestions.slice(0, 10).map((suggestion, index) => (
                <li
                  key={index} 
                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                  // eslint-disable-next-line no-unused-vars
                  onClick={(e) => {
                    
                    console.log("Suggestion clicked:", suggestion);
                    handleSearchSubmit(suggestion); 
                  }}
                >
                  <span className="mr-2">🔍</span> 
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Right*/}
      <div className="flex items-center">
        <img
          className="h-8 cursor-pointer"
          alt="user_logo"
          src="https://cdn-icons-png.flaticon.com/128/17446/17446833.png"
        />
      </div>
    </div>
  );
};

export default Head;
