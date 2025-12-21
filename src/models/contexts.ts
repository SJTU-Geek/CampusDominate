import { LEVELS } from "@/constants/rates";
import { MAP } from "./map-data";
import { EmojiSticker } from "./emoji";

export interface OffscreenMapRenderingContext {
    MAP: typeof MAP;
    LEVELS: typeof LEVELS;
    areaLevelMap: Record<string, number>;
    emojiStickers: EmojiSticker[];
    theme: "light" | "dark";
    mapWidth: number;
    mapHeight: number;
    canvasPadding: number;
    colorTokens: Record<string, string>;
    templateUrl: string;
    mapOffset: number[];
    scale: number;
    // titleOffset: number[];
    // descRect: number[];
}
