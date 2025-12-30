import { EmojiClickData } from "emoji-picker-react";
import { createContext, PropsWithChildren, useCallback, useState } from "react";

interface ControlSettingContextType {
  level: number;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  region: string;
  setRegion: React.Dispatch<React.SetStateAction<string>>;
  selectedEmoji: EmojiClickData | null;
  setSelectedEmoji: React.Dispatch<React.SetStateAction<EmojiClickData | null>>;
}

export const ControlSettingContext = createContext<ControlSettingContextType>({
  level: 0,
  setLevel: () => {},
  region: "minhang",
  setRegion: () => {},
  selectedEmoji: null,
  setSelectedEmoji: () => {},
});

export const ControlSettingContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiClickData | null>(null);
  const [region, setRegion] = useState<string>("minhang");
  const [level, setLevel] = useState(0);

  const value = {
    selectedEmoji,
    setSelectedEmoji,
    region,
    setRegion,
    level,
    setLevel,
  };

  return (
    <ControlSettingContext.Provider value={value}>
      {children}
    </ControlSettingContext.Provider>
  );
};
