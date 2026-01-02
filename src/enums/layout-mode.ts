export enum LayoutMode {
  RotateUltraWide = "RotateUltraWide", // < 3.86:9
  RotateWide = "RotateWide", // 3.86:9 ~ 5:9
  RotateStandard = "RotateStandard", // 5:9 ~ 6.75:9
  RotateNarrow = "RotateNarrow", // 6.75:9 ~ 8:9
  Square = "Square", // 8:9 ~ 10:9
  Narrow = "Narrow", // 10:9 ~ 12:9
  Standard = "Standard", // 12:9 ~ 16:9
  Wide = "Wide", // 16:9 ~ 21:9
  UltraWide = "UltraWide", // > 21:9
}