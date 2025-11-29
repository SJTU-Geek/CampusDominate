import { OffscreenMapRenderingContext } from "@/models/contexts";
import { buildPathFromRelativePointsAndTranslate } from "@/utils/shape";

self.onmessage = async (e) => {
  const { 
    MAP, 
    LEVELS, 
    areaLevelMap, 
    theme, 
    mapWidth, 
    mapHeight, 
    colorTokens, 
    templateUrl,
    mapOffset,
    scale
  } = e.data as OffscreenMapRenderingContext;
  const [width, height] = [1792, 2400];
  const fontFace = new FontFace('JiaLiDaYuanJ', 'url(../assets/font.ttf)');
  await fontFace.load();
  // @ts-ignore 
  self.fonts.add(fontFace);
  
  const offscreen = new OffscreenCanvas(width, height);
  const ctx = offscreen.getContext("2d")!;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  // ctx.scale(scale, scale);
  ctx.textBaseline = "top";

  const img = await fetch(templateUrl);
  const imgBlob = await img.blob();
  const bitmap = await createImageBitmap(imgBlob);
  ctx.drawImage(bitmap, 0, 0, 1792, 2400);

  ctx.translate(mapOffset[0], mapOffset[1]);
  ctx.scale(scale, scale);

  const mapAreas = MAP.layers.find((layer) => layer.name === "area")?.layers!;
  for (const area of mapAreas) {
    let offset = area.transform ?
      [area.transform[0], area.transform[1]] : 
      [0, 0];
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
    ctx.fillStyle = colorTokens[colorTokenName] ||
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
      const x = transform[0] + (label.size[0] - lineWidth) / 2; // center align
      const y = transform[1] + (label.size[1] - totalHeight) / 2 + i * 14;
      ctx.fillText(text, x, y);
    }
  }
  // ctx.resetTransform();

  // 返回图片
  const blob = await offscreen.convertToBlob({ type: "image/png" });
  self.postMessage({ blob });
};