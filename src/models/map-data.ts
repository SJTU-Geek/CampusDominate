import mapData from "@/assets/map-data.json";

export interface MapData {
    id: string;
    name: string;
    size: number[];
    layers: MapLayer[];
}

export interface MapLayer {
    _t: string;
    id: string;
    name: string;
    size: number[];
    text?: string;
    transform?: number[];
    points?: number[][];
    layers?: MapLayer[];
}

export const MAP: MapData = mapData as MapData;