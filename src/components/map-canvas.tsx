import { useTheme } from "next-themes";
import React, { useRef, useEffect, useCallback, useContext } from "react";
import { Center, useChakraContext } from "@chakra-ui/react";
import { MAP } from "@/models/map-data";
import {
  buildPathFromRelativePointsAndTranslate,
} from "@/utils/shape";
import { LEVELS } from "@/constants/rates";
import { DrawStateContext } from "@/contexts/draw-state";
import { ControlSettingContext } from "@/contexts/control-setting";

interface MapCanvasProps {
  level: number;
  scale: number;
  canvasPadding: number;
}

const MapCanvas: React.FC<MapCanvasProps> = ({
  level,
  scale,
  canvasPadding,
}) => {
  const { theme } = useTheme();
  const chakra = useChakraContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { 
    areaLevelMap, 
    setAreaLevelMap, 
    stickers, 
    addSticker,
  } = useContext(DrawStateContext);
  const { selectedEmoji } = useContext(ControlSettingContext);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // clear the paint area
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);
    ctx.scale(scale, scale);
    ctx.textBaseline = "top";

    const mapAreas = MAP.layers.find((layer) => layer.name === "area")?.layers!;
    for (const area of mapAreas) {
      let offset = area.transform ?
        [area.transform[0] + canvasPadding, area.transform[1] + canvasPadding] : 
        [canvasPadding, canvasPadding];
      const path2d = new Path2D(
        buildPathFromRelativePointsAndTranslate(area.size, area.points!, offset)
      );
      const targetRate = LEVELS[areaLevelMap[area.name] ?? (LEVELS.length - 1)];
      const colorTokenName = 
        "colors." + 
        targetRate.color + 
        "." + 
        (
          theme === "dark" ? 
            targetRate.levelDark : 
            targetRate.levelLight
        );
      ctx.fillStyle =
        chakra.tokens.getByName(colorTokenName)?.value ||
        (theme === "dark" ? "#333" : "#fff");
      ctx.fill(path2d);
      ctx.strokeStyle = theme === "dark" ? "#fff" : "#333";
      ctx.lineWidth = 2;
      ctx.stroke(path2d);
    }
    const mapLabels = MAP.layers.find(
      (layer) => layer.name === "label"
    )?.layers!;
    for (const label of mapLabels) {
      let labelLines = [];
      let maxWidth = 0;
      if (label.text!.includes("\n")) {
        labelLines = label.text!.split("\n");
        maxWidth = ctx.measureText(label.text!).width;
      } else {
        let tmpText = label.text!;
        while (tmpText.length > 0) {
          for (let len = tmpText.length; len > 0; len--) {
            const substr = tmpText.substring(0, len);
            const width = ctx.measureText(substr).width;
            if (width <= label.size[0] || len === 1) {
              if (width > maxWidth) maxWidth = width;
              labelLines.push(substr);
              tmpText = tmpText.substring(len);
              break;
            }
          }
        }
      }
      const totalHeight = labelLines.length * 14; // assuming 14px line height
      const totalWidth = maxWidth;
      ctx.font = "14px JiaLiDaYuanJ";
      ctx.fillStyle = areaLevelMap[label.name] == LEVELS.length - 1 ? 
        (theme === "dark" ? "#fff" : "#333") :
        "#fff";
      for (let i = 0; i < labelLines.length; i++) {
        const text = labelLines[i];
        const lineWidth = ctx.measureText(text).width;
        const transform = label.transform ?? [0, 0];
        const x = canvasPadding + transform[0] + (label.size[0] - lineWidth) / 2; // center align
        const y = canvasPadding + transform[1] + (label.size[1] - totalHeight) / 2 + i * 14;
        ctx.fillText(text, x, y);
      }
    }
    if (stickers.length) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font =
        "32px \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Noto Color Emoji\", sans-serif";
      for (const sticker of stickers) {
        const x = sticker.x + canvasPadding;
        const y = sticker.y + canvasPadding;
        ctx.fillText(sticker.emoji, x, y);
      }
      ctx.restore();
    }
  }, [areaLevelMap, canvasPadding, chakra, scale, stickers, theme]);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const x = (e.clientX - rect.left) * dpr;
      const y = (e.clientY - rect.top) * dpr;

      if (selectedEmoji) {
        const mapX = x / (dpr * scale) - canvasPadding;
        const mapY = y / (dpr * scale) - canvasPadding;
        addSticker(selectedEmoji.emoji, mapX, mapY);
        e.stopPropagation();
        return;
      }

      const mapAreas = MAP.layers.find(
        (layer) => layer.name === "area"
      )?.layers!;
      for (const area of mapAreas) {
        let offset = area.transform ?
          [area.transform[0] + canvasPadding, area.transform[1] + canvasPadding] : 
          [canvasPadding, canvasPadding];
        const path2d = new Path2D(
          buildPathFromRelativePointsAndTranslate(
            area.size,
            area.points!,
            offset
          )
        );
        if (ctx.isPointInPath(path2d, x, y)) {
          setAreaLevelMap((prev) => {
            const cur = prev![area.name];
            if (cur === level) {
              return { ...prev, [area.name]: LEVELS.length - 1 };
            }
            return { ...prev, [area.name]: level };
          });
          e.stopPropagation();
          break;
        }
      }
    },
    [addSticker, canvasPadding, level, scale, selectedEmoji, setAreaLevelMap]
  );

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <Center flex="1">
      <canvas
        ref={canvasRef}
        width={(MAP.size[0] * scale + canvasPadding * 2) * (window.devicePixelRatio || 1)}
        height={(MAP.size[1] * scale + canvasPadding * 2) * (window.devicePixelRatio || 1)}
        style={{
          display: "block",
          width: (MAP.size[0] * scale + canvasPadding * 2) + "px",
          height: (MAP.size[1] * scale + canvasPadding * 2) + "px",
          backgroundColor: "inherit",
          border: "none",
        }}
        onClick={handleCanvasClick}
      />
    </Center>
  );
};

export default MapCanvas;
