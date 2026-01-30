import { EmojiSticker } from "@/models/emoji";
import { useLocalStorageState } from "ahooks";
import { createContext, PropsWithChildren, useCallback, useContext, useState } from "react";
import { ControlSettingContext } from "./control-setting";
import { SetState } from "ahooks/lib/createUseStorageState";
import { MAP } from "@/models/map-data";
import { LEVELS } from "@/constants/rates";

interface DrawStateContextType {
  stickers: EmojiSticker[];
  addSticker: (emoji: string, url: string, x: number, y: number) => void;
  clearStickers: () => void;  
  areaLevelMap: Record<string, number>;
  setAreaLevelMap: (value: SetState<Record<string, number>>) => void;
  resetLevelMap: () => void;
}

export const DrawStateContext = createContext<DrawStateContextType>({
  stickers: [],
  addSticker: () => {},
  clearStickers: () => {},  
  areaLevelMap: {},
  setAreaLevelMap: () => {},
  resetLevelMap: () => {},
});

const initialAreaLevelMap = Object.fromEntries(
  MAP.layers.find((layer) => layer.name === "area")?.layers!.map(x => [x.name, LEVELS.length - 1])!
)

export const DrawStateContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [stickers, setStickers] = useLocalStorageState<EmojiSticker[]>(
    "emoji-stickers",
    { defaultValue: [] }
  );
  const {selectedEmoji, setSelectedEmoji} = useContext(ControlSettingContext);
  const [areaLevelMap, setAreaLevelMap] = useLocalStorageState<Record<string, number>>("levelmap", { defaultValue: initialAreaLevelMap });
  

  const addSticker = useCallback(
    (emoji: string, url: string, x: number, y: number) => {
      setStickers((prev = []) => [
        ...prev,
        {
          id:
            crypto.randomUUID?.() ??
            `${Date.now()}-${Math.round(Math.random() * 10000)}`,
          emoji,
          url,
          x,
          y,
        },
      ]);
    },
    [setStickers]
  );

  const clearStickers = useCallback(() => {
    setStickers([]);
    setSelectedEmoji(null);
  }, [setStickers]);

  const resetLevelMap = () => {
    setAreaLevelMap(initialAreaLevelMap);
  }

  const value = {
    stickers,
    addSticker,
    clearStickers,    
    areaLevelMap,
    setAreaLevelMap,
    resetLevelMap,
  };

  return (
    <DrawStateContext.Provider value={value}>
      {children}
    </DrawStateContext.Provider>
  );
};
