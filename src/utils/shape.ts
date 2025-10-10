export function buildPathFromPoints(points: number[][]): string {
  if (points.length === 0) return "";
  let path = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i][0]} ${points[i][1]}`;
  }
  path += " Z";
  return path;
}

export function buildPathFromRelativePoints(size: number[], points: number[][]): string {
  if (points.length === 0) return "";
  let path = `M ${points[0][0] * size[0]} ${points[0][1] * size[1]}`;
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i][0] * size[0]} ${points[i][1] * size[1]}`;
  }
  path += " Z";
  return path;
}

export function buildPathFromRelativePointsAndTranslate(size: number[], points: number[][], translate: number[]): string {
  if (points.length === 0) return "";
  let path = `M ${points[0][0] * size[0] + translate[0]} ${points[0][1] * size[1] + translate[1]}`;
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i][0] * size[0] + translate[0]} ${points[i][1] * size[1] + translate[1]}`;
  }
  path += " Z";
  return path;
}