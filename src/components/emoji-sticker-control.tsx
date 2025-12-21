import type React from "react";
import { useContext, useMemo, useState } from "react";
import EmojiPicker, {
  EmojiClickData,
  Theme as EmojiPickerTheme,
} from "emoji-picker-react";
import { Box, Button, IconButton, Portal, Stack, Text } from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { EmojiStickerContext } from "@/contexts/emoji-stickers";
import { LuSmilePlus, LuX } from "react-icons/lu";

export const EmojiStickerControl = () => {
  const { selectedEmoji, setSelectedEmoji } = useContext(EmojiStickerContext);
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);

  const closePicker = () => setOpen(false);

  const pickerTheme = useMemo(
    () => (theme === "dark" ? EmojiPickerTheme.DARK : EmojiPickerTheme.LIGHT),
    [theme]
  );
  const pickerStyle = useMemo<React.CSSProperties>(() => {
    return {
      "--epr-emoji-size": "28px",
      "--epr-emoji-padding": "4px",
    } as React.CSSProperties;
  }, []);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setSelectedEmoji(emojiData.emoji);
    setOpen(false);
  };

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    closePicker();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    closePicker();
    requestAnimationFrame(() => {
      const target = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
      if (target && typeof target.click === "function") {
        target.click();
      }
    });
  };

  const handleStopPlacing = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSelectedEmoji(null);
    setOpen(false);
  };

  return (
    <Box position="relative" w="100%">
      <IconButton
        onClick={handleToggle}
        aria-label="pick-emoji"
        fontSize="xl"
        variant={selectedEmoji ? "solid" : "ghost"}
      >
        {selectedEmoji ?? <LuSmilePlus />}
      </IconButton>
      {open && (
        <Portal>
          <Box
            position="fixed"
            inset="0"
            zIndex={1400}
            backgroundColor="transparent"
            onClick={handleOverlayClick}
          />
          <Box
            position="fixed"
            left="54px"
            bottom="72px"
            zIndex={1500}
            borderRadius="lg"
            boxShadow="lg"
            borderWidth="1px"
            backgroundColor={theme === "dark" ? "gray.800" : "white"}
            color={theme === "dark" ? "gray.100" : "gray.800"}
            p="2"
            width="280px"
            onClick={(e) => e.stopPropagation()}
          >
            <Box borderRadius="md" overflow="hidden">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                lazyLoadEmojis
                theme={pickerTheme}
                previewConfig={{ showPreview: false }}
                width={260}
                height={200}
                style={pickerStyle}
                searchDisabled
              />
            </Box>
            <Stack mt="2" direction="row" justify="space-between" gap="2">
              <Button size="sm" variant="outline" onClick={handleStopPlacing}>
                停止贴表情
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClose}
              >
                <LuX />
                收起
              </Button>
            </Stack>
            <Text fontSize="sm" mt="1">
              点击地图任意位置贴表情。
            </Text>
          </Box>
        </Portal>
      )}
    </Box>
  );
};
