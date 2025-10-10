import { useTheme } from "next-themes";
import React, { useRef, useEffect, useCallback, useState } from "react";
import { Box } from "@chakra-ui/react";
import { MAP } from "@/models/map-data";
import { buildPathFromRelativePoints, buildPathFromRelativePointsAndTranslate } from "@/utils/shape";

const DEFAULT_COLOR = "#cccccc";

function getLabelPos(path: string): [number, number] {
  const match = path.match(/M\s*([-\d.]+),([-\d.]+)/i);
  if (match) {
    return [parseFloat(match[1]), parseFloat(match[2])];
  }
  return [0, 0];
}

interface MapCanvasProps {
  color: string;
  scale: number;
  selectedColors: { [name: string]: string };
  setSelectedColors: React.Dispatch<
    React.SetStateAction<{ [name: string]: string }>
  >;
}

const MapCanvas: React.FC<MapCanvasProps> = ({
  color,
  scale,
  selectedColors,
  setSelectedColors,
}) => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      const path2d = new Path2D(buildPathFromRelativePoints(area.size, area.points!));
      ctx.translate(area.transform ? area.transform[0] : 0, area.transform ? area.transform[1] : 0);
      ctx.fillStyle = selectedColors[area.name] || DEFAULT_COLOR;
      ctx.fill(path2d);
      ctx.strokeStyle = theme === "dark" ? "#fff" : "#333";
      ctx.lineWidth = 2;
      ctx.stroke(path2d);
      ctx.translate(-(area.transform ? area.transform[0] : 0), -(area.transform ? area.transform[1] : 0));
    }
    const mapLabels = MAP.layers.find((layer) => layer.name === "label")?.layers!;
    for (const label of mapLabels) {
      let labelLines = [];
      let maxWidth = 0; 
      if (label.text!.includes("\n")) {
        labelLines = label.text!.split("\n");
        maxWidth = ctx.measureText(label.text!).width;
      }
      else {
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
      ctx.font = "14px Sans-serif";
      ctx.fillStyle = theme === "dark" ? "#fff" : "#333";
      for (let i = 0; i < labelLines.length; i++) {
        const text = labelLines[i];
        const lineWidth = ctx.measureText(text).width;
        const transform = label.transform ?? [0, 0];
        const x = transform[0] + (label.size[0] - lineWidth) / 2; // center align
        const y = transform[1] + (label.size[1] - totalHeight) / 2 + i * 14;
        ctx.fillText(text, x, y);
      }
    }
  }, [selectedColors, color, theme]);

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

      const mapAreas = MAP.layers.find((layer) => layer.name === "area")?.layers!;
      for (const area of mapAreas) {
        const path2d = new Path2D(buildPathFromRelativePointsAndTranslate(area.size, area.points!, area.transform ?? [0, 0]));
        if (ctx.isPointInPath(path2d, x, y)) {
          setSelectedColors((prev) => {
            const cur = prev[area.name];
            if (cur === color) {
              // toggle off
              const copy = { ...prev };
              delete copy[area.name];
              return copy;
            }
            return { ...prev, [area.name]: color };
          });
          break;
        }
      }
    },
    [color, setSelectedColors]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas && container) {
      // init canvas size
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      draw();
    }
  }, [draw]);

  return (
    <Box
      ref={containerRef}
      style={{
        width: "100%",
        height: "calc(100vh - 200px)",
        border: "unset",
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          backgroundColor: theme === "dark" ? "#1a202c" : "#f0f0f0",
        }}
        onClick={handleCanvasClick}
      />
    </Box>
  );
};

export default MapCanvas;
