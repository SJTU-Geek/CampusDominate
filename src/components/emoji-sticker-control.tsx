import type React from "react";
import { useContext, useMemo, useState } from "react";
import EmojiPicker, {
  Emoji,
  EmojiClickData,
  Theme as EmojiPickerTheme,
  EmojiStyle,
} from "emoji-picker-react";
import { Box, Button, IconButton, Popover, Portal, Span, Stack, Text } from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { LuSmilePlus, LuX } from "react-icons/lu";
import { ControlSettingContext } from "@/contexts/control-setting";

export const EmojiStickerControl = () => {
  const { selectedEmoji, setSelectedEmoji } = useContext(ControlSettingContext);
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
    setSelectedEmoji(emojiData);
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
    <Popover.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Popover.Trigger asChild>
        <Box position="relative">
          <IconButton
            onClick={handleToggle}
            aria-label="pick-emoji"
            color={"black"}
            borderRadius="24px"
            border={"none"}
            background={"linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"}
            width="auto"
            minWidth="48px"
            height="48px"
          >
            <Span>
              {
                selectedEmoji !== null ? 
                  <Emoji unified={selectedEmoji.unified} size={26} emojiStyle={EmojiStyle.GOOGLE}/> : 
                  <Stack direction="row" marginInline="20px">
                    <LuSmilePlus size={24} />
                    贴表情
                  </Stack>
              }
            </Span>
          </IconButton>
        </Box>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content width="auto">
            <Popover.Arrow />
            <Popover.Body padding={0} background="transparent">
              <Box
                borderRadius="lg"
                boxShadow="lg"
                borderWidth="1px"
                backgroundColor={theme === "dark" ? "gray.800" : "white"}
                color={theme === "dark" ? "gray.100" : "gray.800"}
                p="2"
                width="320px"
                onClick={(e) => e.stopPropagation()}
              >
                <Box borderRadius="md" overflow="hidden">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    lazyLoadEmojis
                    emojiStyle={EmojiStyle.GOOGLE}
                    theme={pickerTheme}
                    previewConfig={{ showPreview: false }}
                    width={300}
                    height={300}
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
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};
