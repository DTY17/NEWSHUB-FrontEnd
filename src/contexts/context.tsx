import type { Counter } from "counterapi";
import { createContext, useContext, useState } from "react";

const DataContext = createContext<any>(null);

export const StoreProvider = ({ children }: any) => {
  const [data, setData] = useState<Counter | null>(null);

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useCounter = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
