import { IconButton, useChakraContext } from "@chakra-ui/react";
import { useCallback, useContext } from "react";
import { LuCamera } from "react-icons/lu";
import { LevelMapContext } from "@/contexts/level-map";
import { EmojiStickerContext } from "@/contexts/emoji-stickers";
import { useTheme } from "next-themes";
import { MAP } from "@/models/map-data";
import { LEVELS } from "@/constants/rates";
import { OffscreenMapRenderingContext } from "@/models/contexts";
import template_light from "@/assets/template_light.png";

export const ScreenshotTrigger = () => {
  const { areaLevelMap } = useContext(LevelMapContext);
  const { stickers: emojiStickers } = useContext(EmojiStickerContext);
  const { theme } = useTheme();
  const chakra = useChakraContext();

  function preloadColors() {
    let dic: Record<string, string> = {};
    LEVELS.forEach(level => {
      var colorToken = "colors." + 
        level.color + 
        "." + 
        (
          theme === "dark" ? 
            level.levelDark : 
            level.levelLight
        );
      dic[colorToken] = chakra.tokens.getByName(colorToken)?.value;
    });
    return dic;
  }

  const handleScreenshot = useCallback(async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    try {
      const canvasPadding = 20; // 边距
      const mapWidth = MAP.size[0]; //1133
      const mapHeight = MAP.size[1];
      const worker = new Worker(new URL("../workers/screenshot-worker.ts", import.meta.url), { type: "module" });
      const colors = preloadColors();
      const templateUrl = template_light;
      const mapOffset = [175, 1112];
      const scale = (1630 - 175) / mapWidth;

      worker.postMessage({
        MAP,
        LEVELS,
        areaLevelMap,
        emojiStickers,
        theme,
        canvasPadding,
        mapWidth,
        mapHeight,
        colorTokens: colors,
        templateUrl,
        mapOffset,
        scale
      } as OffscreenMapRenderingContext);

      worker.onmessage = (event) => {
        const { blob } = event.data;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "我的交大制霸.png";
        a.click();
        URL.revokeObjectURL(url);
        worker.terminate();
      };
    } catch (error) {
      console.error("Screenshot failed:", error);
    }
  }, [areaLevelMap, emojiStickers, theme]);

  return (
    <IconButton onClick={handleScreenshot} aria-label="screenshot">
      <LuCamera />
    </IconButton>
  );
};

