"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Type definitions
interface DnDContextType {
  dragType: string | null;
  setDragType: (type: string | null) => void;
}

interface DnDProviderProps {
  children: ReactNode;
}

// Create the context
const DnDContext = createContext<DnDContextType | undefined>(undefined);

// Provider component
export const DnDProvider: React.FC<DnDProviderProps> = ({ children }) => {
  const [dragType, setDragType] = useState<string | null>(null);

  const value: DnDContextType = {
    dragType,
    setDragType,
  };

  return (
    <DnDContext.Provider value={value}>
      {children}
    </DnDContext.Provider>
  );
};

// Custom hook to use the DnD context
export const useDnD = (): DnDContextType => {
  const context = useContext(DnDContext);
  
  if (context === undefined) {
    throw new Error('useDnD must be used within a DnDProvider');
  }
  
  return context;
};

// Export the context for advanced usage if needed
export { DnDContext };