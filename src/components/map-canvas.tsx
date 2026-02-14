import { useTheme } from "next-themes";
import React, { useRef, useEffect, useCallback, useContext, useMemo, useState } from "react";
import { Center, Flex, useChakraContext } from "@chakra-ui/react";
import { MAP } from "@/models/map-data";
import {
  buildPathFromRelativePointsAndTranslate,
} from "@/utils/shape";
import { LEVELS } from "@/constants/rates";
import { DrawStateContext } from "@/contexts/draw-state";
import { ControlSettingContext } from "@/contexts/control-setting";
import { EmojiSticker } from "@/models/emoji";

interface MapCanvasProps {
  scale: number;
  canvasPadding: number;
  align?: string;
  rotated?: boolean; // for canvas, we use native support
}

const MapCanvas: React.FC<MapCanvasProps> = ({
  scale,
  canvasPadding,
  align,
  rotated
}) => {
  const { theme } = useTheme();
  const chakra = useChakraContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [refresh,setRefresh]=useState(0)
  const { 
    areaLevelMap, 
    setAreaLevelMap, 
    stickers, 
    addSticker,
    removeSticker,
  } = useContext(DrawStateContext);
  const { selectedEmoji, level, specialDisplay } = useContext(ControlSettingContext);

  const canvasSize = useMemo(() => {
    if (rotated) {
      return [MAP.size[1] * scale + canvasPadding * 2, MAP.size[0] * scale + canvasPadding * 2];
    }
    else {
      return [MAP.size[0] * scale + canvasPadding * 2, MAP.size[1] * scale + canvasPadding * 2];
    }
  }, [MAP, scale, canvasPadding]);

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
    if (rotated) {
      ctx.rotate(90 / 360 * (2 * Math.PI));
      ctx.translate(0, -canvas.width / scale / dpr);
    }
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
    function getEmojiImage(emoji: EmojiSticker) {
      const url = emoji.url;
      const img = new Image();
      // 关键：跨域配置（CDN 图片需要允许跨域，否则画布会污染）
      img.crossOrigin = 'anonymous';
      // 图片加载完成回调
      // 加载失败回调
      // 设置图片 URL（触发加载）
      img.src = url;
      return img;
    }
    if (stickers.length) {
      ctx.save();
      for (const sticker of stickers) {
        const emojiSize = 32;
        const emoji = getEmojiImage(sticker)
        const x = sticker.x + canvasPadding;
        const y = sticker.y + canvasPadding;
        ctx.drawImage(
          emoji,
          x - emojiSize / 2, // 向左偏移一半宽度
          y - emojiSize / 2, // 向上偏移一半高度
          emojiSize, // 绘制宽度
          emojiSize  // 绘制高度
        );
      }
    ctx.restore();
    }
  }, [areaLevelMap, canvasPadding, chakra, scale, stickers, theme, refresh]);

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
        let mapX = x / (dpr * scale) - canvasPadding;
        let mapY = y / (dpr * scale) - canvasPadding;
        if (rotated) {
          let t = mapX;
          mapX = mapY;
          mapY = MAP.size[1] - t;
        }
        addSticker(selectedEmoji.emoji, selectedEmoji.imageUrl, mapX, mapY);
        e.stopPropagation();
        return;
      }
      if (specialDisplay){
        let mapX = x / (dpr * scale) - canvasPadding;
        let mapY = y / (dpr * scale) - canvasPadding;
        if (rotated) {
          let t = mapX;
          mapX = mapY;
          mapY = MAP.size[1] - t;
        }
        let distanceSquare = Infinity;
        let stickerId = null;
        for (const sticker of stickers) {
          const dx = mapX - sticker.x;
          const dy = mapY - sticker.y;
          const distanceSquareCurrent = dx * dx + dy * dy;
          if (distanceSquareCurrent<distanceSquare)
          {
            distanceSquare=distanceSquareCurrent;
            stickerId=sticker.id;
          }
        }
        if (distanceSquare<=16*16)
        {
          if (stickerId!=null)
          {
            removeSticker(stickerId)
          }
        }
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

  useEffect(() => {
    let mounted = true;
    const fontFamily = 'JiaLiDaYuanJ';
    const fontSize = '14px';

    if (document.fonts && document.fonts.check) {
      if (document.fonts.check(`${fontSize} ${fontFamily}`)) {
        return;
      }
    }

    if (document.fonts && document.fonts.load) {
      document.fonts.load(`${fontSize} ${fontFamily}`)
        .then(() => {
          if (mounted) {
            setRefresh(prev => prev + 1);
          }
        })
    }

    return () => { mounted = false; };
  }, []); 

  return (
    <Flex flex="1" direction="row" align={align ?? "center"} justifyContent="center">
      <canvas
        ref={canvasRef}
        width={canvasSize[0] * (window.devicePixelRatio || 1)}
        height={canvasSize[1] * (window.devicePixelRatio || 1)}
        style={{
          display: "block",
          width: canvasSize[0] + "px",
          height: canvasSize[1] + "px",
          backgroundColor: "inherit",
          border: "none",
          zIndex:1
        }}
        onClick={handleCanvasClick}
      />
    </Flex>
  );
};

export default MapCanvas;
