import React, { createContext, useState } from 'react';

export const SchoolContext = createContext();

export const SchoolProvider = ({ children }) => {
  const [schoolDetail, setSchoolDetail] = useState([]);
  return (
    <SchoolContext.Provider value={{ schoolDetail, setSchoolDetail }}>
      {children}
    </SchoolContext.Provider>
  );
};
