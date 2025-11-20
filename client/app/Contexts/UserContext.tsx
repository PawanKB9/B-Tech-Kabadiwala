"use client"

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context value
interface Location {
  [key: string]: any; // You can replace this with a stricter type if you know the structure
}

interface UserContextType {
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Props type for the provider
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [location, setLocation] = useState<Location>({});

  return (
    <UserContext.Provider value={{ location, setLocation }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
