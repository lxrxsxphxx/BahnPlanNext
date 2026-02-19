import { createContext, useContext, useState } from "react";
import type { Wagen } from "./WagenCard";

interface WagonContextType {
  myWagons: Wagen[];
  addWagon: (wagen: Wagen) => void;
}

const WagonContext = createContext<WagonContextType | undefined>(undefined);

export const WagonProvider = ({ children }: { children: React.ReactNode }) => {
  const [myWagons, setMyWagons] = useState<Wagen[]>([]);

  const addWagon = (wagen: Wagen) => {
    setMyWagons((prev) => [...prev, wagen]);
  };

  return (
    <WagonContext.Provider value={{ myWagons, addWagon }}>
      {children}
    </WagonContext.Provider>
  );
};

export const useWagon = () => {
  const context = useContext(WagonContext);
  if (!context) throw new Error("useWagon must be used within WagonProvider");
  return context;
};
