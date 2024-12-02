import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userDetail, setUserDetail] = useState([]);
  return (
    <UserContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </UserContext.Provider>
  );
};
