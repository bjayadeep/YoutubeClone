import React from "react";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const Body = () => {
  const isMenuOpen = useSelector((store) => store.app.isMenuOpen);

  return (
    <div className="flex pt-[64px]">
      {isMenuOpen && (
        <Sidebar />
      )}

      <div className={`flex-1 ${isMenuOpen ? 'ml-56' : 'ml-0 w-full'} transition-all duration-300 px-5`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Body;
