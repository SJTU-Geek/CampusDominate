import { useTheme } from "next-themes";
import React, { useRef, useEffect, useCallback } from "react";
import { Center, useChakraContext } from "@chakra-ui/react";
import { MAP } from "@/models/map-data";
import {
  buildPathFromRelativePoints,
  buildPathFromRelativePointsAndTranslate,
} from "@/utils/shape";
import { LEVELS } from "@/constants/rates";

interface MapCanvasProps {
  level: number;
  scale: number;
  areaLevelMap: { [name: string]: number };
  setAreaLevelMap: React.Dispatch<
    React.SetStateAction<{ [name: string]: number }>
  >;
}

const MapCanvas: React.FC<MapCanvasProps> = ({
  level,
  scale,
  areaLevelMap,
  setAreaLevelMap,
}) => {
  const { theme } = useTheme();
  const chakra = useChakraContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      // draw building
      const path2d = new Path2D(
        buildPathFromRelativePoints(area.size, area.points!)
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
      ctx.translate(
        area.transform ? area.transform[0] : 0,
        area.transform ? area.transform[1] : 0
      );
      ctx.fillStyle =
        chakra.tokens.getByName(colorTokenName)?.value ||
        (theme === "dark" ? "#333" : "#fff");
      ctx.fill(path2d);
      ctx.strokeStyle = theme === "dark" ? "#fff" : "#333";
      ctx.lineWidth = 2;
      ctx.stroke(path2d);
      ctx.translate(
        -(area.transform ? area.transform[0] : 0),
        -(area.transform ? area.transform[1] : 0)
      );
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
        const x = transform[0] + (label.size[0] - lineWidth) / 2; // center align
        const y = transform[1] + (label.size[1] - totalHeight) / 2 + i * 14;
        ctx.fillText(text, x, y);
      }
    }
  }, [areaLevelMap, theme, scale]);

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

      const mapAreas = MAP.layers.find(
        (layer) => layer.name === "area"
      )?.layers!;
      for (const area of mapAreas) {
        const path2d = new Path2D(
          buildPathFromRelativePointsAndTranslate(
            area.size,
            area.points!,
            area.transform ?? [0, 0]
          )
        );
        if (ctx.isPointInPath(path2d, x, y)) {
          setAreaLevelMap((prev) => {
            const cur = prev[area.name];
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
    [level, setAreaLevelMap]
  );

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <Center flex="1">
      <canvas
        ref={canvasRef}
        width={MAP.size[0] * scale * (window.devicePixelRatio || 1)}
        height={MAP.size[1] * scale * (window.devicePixelRatio || 1)}
        style={{
          display: "block",
          width: MAP.size[0] * scale + "px",
          height: MAP.size[1] * scale + "px",
          backgroundColor: "inherit",
          border: "none",
        }}
        onClick={handleCanvasClick}
      />
    </Center>
  );
};

export default MapCanvas;
