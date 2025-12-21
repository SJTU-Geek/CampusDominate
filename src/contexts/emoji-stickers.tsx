import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useLocalStorageState } from "ahooks";
import { EmojiSticker } from "@/models/emoji";

interface EmojiStickerContextType {
  stickers: EmojiSticker[];
  addSticker: (emoji: string, x: number, y: number) => void;
  clearStickers: () => void;
  selectedEmoji: string | null;
  setSelectedEmoji: (emoji: string | null) => void;
}

export const EmojiStickerContext = createContext<EmojiStickerContextType>({
  stickers: [],
  addSticker: () => {},
  clearStickers: () => {},
  selectedEmoji: null,
  setSelectedEmoji: () => {},
});

export const EmojiStickerContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [stickers, setStickers] = useLocalStorageState<EmojiSticker[]>(
    "emoji-stickers",
    { defaultValue: [] }
  );
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const addSticker = useCallback(
    (emoji: string, x: number, y: number) => {
      setStickers((prev = []) => [
        ...prev,
        {
          id:
            crypto.randomUUID?.() ??
            `${Date.now()}-${Math.round(Math.random() * 10000)}`,
          emoji,
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

  const value = useMemo(
    () => ({
      stickers: stickers ?? [],
      addSticker,
      clearStickers,
      selectedEmoji,
      setSelectedEmoji,
    }),
    [stickers, addSticker, clearStickers, selectedEmoji]
  );

  return (
    <EmojiStickerContext.Provider value={value}>
      {children}
    </EmojiStickerContext.Provider>
  );
};
