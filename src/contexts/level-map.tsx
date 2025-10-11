import { LEVELS } from "@/constants/rates";
import { MAP } from "@/models/map-data";
import { createContext, useState } from "react";

export interface LevelMapContextType {
  areaLevelMap: Record<string, number>;
  setAreaLevelMap: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  resetLevelMap: () => void;
}

export const LevelMapContext = createContext<LevelMapContextType>({
  areaLevelMap: {},
  setAreaLevelMap: () => {},
  resetLevelMap: () => {},
});

const initialAreaLevelMap = Object.fromEntries(
  MAP.layers.find((layer) => layer.name === "area")?.layers!.map(x => [x.name, LEVELS.length - 1])!
)

export const LevelMapContextProvider = (props : any) => {
  const [areaLevelMap, setAreaLevelMap] = useState<Record<string, number>>(initialAreaLevelMap);
  
  const resetLevelMap = () => {
    setAreaLevelMap(initialAreaLevelMap);
  }

  const contextValue: LevelMapContextType = {
    areaLevelMap: areaLevelMap,
    setAreaLevelMap: setAreaLevelMap,
    resetLevelMap: resetLevelMap,
  };

  return (
    <LevelMapContext.Provider value={contextValue}>
      {props.children}
    </LevelMapContext.Provider>
  )
}