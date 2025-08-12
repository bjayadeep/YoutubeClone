import React from 'react';
import { Outlet } from 'react-router-dom';
import Head from './Head';
const Layout = () => {
  return (

    <>
      <Head />
      <Outlet />
    </>
  );
};

export default Layout;
