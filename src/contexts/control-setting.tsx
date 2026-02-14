import { EmojiClickData } from "emoji-picker-react";
import { createContext, PropsWithChildren, useCallback, useState } from "react";

interface ControlSettingContextType {
  bgHue: number, 
  setBgHue: React.Dispatch<React.SetStateAction<number>>,
  level: number;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  region: string;
  setRegion: React.Dispatch<React.SetStateAction<string>>;
  selectedEmoji: EmojiClickData | null ;
  setSelectedEmoji: React.Dispatch<React.SetStateAction<EmojiClickData | null>>;
  specialDisplay: number;
  setSpecialDisplay: React.Dispatch<React.SetStateAction<number>>;
}

export const ControlSettingContext = createContext<ControlSettingContextType>({
  bgHue: 0,
  setBgHue: () => {},
  level: 0,
  setLevel: () => {},
  region: "minhang",
  setRegion: () => {},
  selectedEmoji: null,
  setSelectedEmoji: () => {},
  specialDisplay: 0,
  setSpecialDisplay: () => {},
});

export const ControlSettingContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiClickData | null>(null);
  const [region, setRegion] = useState<string>("minhang");
  const [level, setLevel] = useState(0);
  const [bgHue, setBgHue] = useState<number>(Math.random() * 360);
  const [specialDisplay,setSpecialDisplay]=useState(0);

  const value = {
    selectedEmoji,
    setSelectedEmoji,
    region,
    setRegion,
    level,
    setLevel,
    bgHue,
    setBgHue,
    specialDisplay,
    setSpecialDisplay,
  };

  return (
    <ControlSettingContext.Provider value={value}>
      {children}
    </ControlSettingContext.Provider>
  );
};
