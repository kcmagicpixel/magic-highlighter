import { createContext, useContext } from "react";
import { type RootStore } from "./root.store";

const StoreContext = createContext<RootStore>(undefined!);

export const useStore = (): RootStore => {
  return useContext(StoreContext);
};

export const StoreProvider = StoreContext.Provider;
