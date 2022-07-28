import { createContext, useState, useContext, useEffect } from 'react';

const FloorContext = createContext();

const DefaultFloor = Number(localStorage.getItem('floor')) || 1;

export const FloorContextProvider = ({ children }) => {
  const [floor, setFloor] = useState(DefaultFloor);

  const values = {
    floor,
    setFloor,
  };

  useEffect(() => {
    localStorage.setItem('floor', floor);
  }, [floor]);

  return <FloorContext.Provider value={values}>{children}</FloorContext.Provider>;
};

export const useFloor = () => {
  const context = useContext(FloorContext);

  if (context === undefined) {
    throw new Error('useFloor must be used within a FloorContextProvider');
  }

  return context;
};
