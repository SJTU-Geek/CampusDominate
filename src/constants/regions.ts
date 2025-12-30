import { MapRegion } from "@/models/region";
import { MapData } from "@/models/map-data";
import minhang from "@/assets/map-data.json";

export const REGIONS: MapRegion[] = [
  { id: "minhang", name: "闵行校区", data: minhang as MapData}
]