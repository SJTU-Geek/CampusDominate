import { IconButton } from "@chakra-ui/react";
import { useCallback } from "react";
import { LuCamera } from "react-icons/lu";
import { snapdom } from "@zumer/snapdom";

export const ScreenshotTrigger = () => {
  const handleScreenshot = useCallback(async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    try {
      const result = await snapdom(document.body);

      await result.download({
        format: "png",
        filename: "我的交大制霸",
      });
    } catch (error) {
      console.error("Screenshot failed:", error);
    }
  }, []);
  return (
    <IconButton onClick={handleScreenshot} aria-label="screenshot">
      <LuCamera />
    </IconButton>
  );
};
