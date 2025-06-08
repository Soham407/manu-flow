
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HiddenTransactionsContextType {
  showHiddenTransactions: boolean;
  toggleHiddenTransactions: () => void;
}

const HiddenTransactionsContext = createContext<HiddenTransactionsContextType | undefined>(undefined);

export const useHiddenTransactions = () => {
  const context = useContext(HiddenTransactionsContext);
  if (context === undefined) {
    throw new Error('useHiddenTransactions must be used within a HiddenTransactionsProvider');
  }
  return context;
};

interface HiddenTransactionsProviderProps {
  children: ReactNode;
}

export const HiddenTransactionsProvider: React.FC<HiddenTransactionsProviderProps> = ({ children }) => {
  const [showHiddenTransactions, setShowHiddenTransactions] = useState(false);

  const toggleHiddenTransactions = () => {
    setShowHiddenTransactions(prev => !prev);
  };

  return (
    <HiddenTransactionsContext.Provider value={{ showHiddenTransactions, toggleHiddenTransactions }}>
      {children}
    </HiddenTransactionsContext.Provider>
  );
};
