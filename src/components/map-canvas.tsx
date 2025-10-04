import { useTheme } from "next-themes";
import React, { useRef, useEffect, useCallback } from "react";
import { Box } from "@chakra-ui/react";
import { Building } from "../models/building";

const DEFAULT_COLOR = "#cccccc";

const buildings: Building[] = [
  {
    name: "霍英东体育馆",
    path: "M290.372,150.124 L350.278,180.234 L370.112,240.183 L320.174,270.122 Z",
  },
]; // TODO: read from external file

function getLabelPos(path: string): [number, number] {
  const match = path.match(/M\s*([-\d.]+),([-\d.]+)/i);
  if (match) {
    return [parseFloat(match[1]), parseFloat(match[2])];
  }
  return [0, 0];
}

interface MapCanvasProps {
  color: string;
  selectedColors: { [name: string]: string };
  setSelectedColors: React.Dispatch<
    React.SetStateAction<{ [name: string]: string }>
  >;
}

const MapCanvas: React.FC<MapCanvasProps> = ({
  color,
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

    for (const building of buildings) {
      // draw building
      const path2d = new Path2D(building.path);
      ctx.fillStyle = selectedColors[building.name] || DEFAULT_COLOR;
      ctx.fill(path2d);
      ctx.strokeStyle = theme === "dark" ? "#fff" : "#333";
      ctx.lineWidth = 2;
      ctx.stroke(path2d);

      // draw building label
      const [x, y] = getLabelPos(building.path);
      ctx.font = "16px Arial";
      ctx.fillStyle = theme === "dark" ? "#fff" : "#333";
      ctx.fillText(building.name, x + 5, y - 5);
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

      for (const building of buildings) {
        const path2d = new Path2D(building.path);
        if (ctx.isPointInPath(path2d, x, y)) {
          setSelectedColors((prev) => {
            const cur = prev[building.name];
            if (cur === color) {
              // toggle off
              const copy = { ...prev };
              delete copy[building.name];
              return copy;
            }
            return { ...prev, [building.name]: color };
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
