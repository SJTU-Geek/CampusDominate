import { EmojiClickData } from "emoji-picker-react";
import { createContext, PropsWithChildren, useCallback, useState } from "react";

interface ControlSettingContextType {
  selectedEmoji: EmojiClickData | null;
  setSelectedEmoji: React.Dispatch<React.SetStateAction<EmojiClickData | null>>;
}

export const ControlSettingContext = createContext<ControlSettingContextType>({
  selectedEmoji: null,
  setSelectedEmoji: () => {},
});

export const ControlSettingContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiClickData | null>(null);

  const value = {
    selectedEmoji,
    setSelectedEmoji,
  };

  return (
    <ControlSettingContext.Provider value={value}>
      {children}
    </ControlSettingContext.Provider>
  );
};
