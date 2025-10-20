import React, { createContext, useContext, useState } from 'react';

const RouterContext = createContext();

export const Router = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [userType, setUserType] = useState(null);

  const navigate = (path) => setCurrentRoute(path);

  return (
    <RouterContext.Provider value={{ currentRoute, navigate, userType, setUserType }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => useContext(RouterContext);