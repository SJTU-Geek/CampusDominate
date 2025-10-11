import React, { useEffect, useRef, useState } from "react";
import MapCanvas from "@/components/map-canvas";
import { Flex, VStack } from "@chakra-ui/react";
import TitleBar from "@/components/titlebar";
import { LEVELS } from "@/constants/rates";
import Footer from "@/components/footer";
import { MAP } from "@/models/map-data";
import RateSelector from "@/components/rate-selector";
import { ColorModeToggle } from "@/components/color-mode-toggle";
import { useTheme } from "next-themes";
import { ScreenshotTrigger } from "./components/screenshot-trigger";
import "@/styles/global.css";

const initialAreaLevelMap = Object.fromEntries(
  MAP.layers.find((layer) => layer.name === "area")?.layers!.map(x => [x.name, LEVELS.length - 1])!
)

const App: React.FC = () => {
  const theme = useTheme();
  const [level, setLevel] = useState(0);
  const [areaLevelMap, setAreaLevelMap] = useState<{
    [name: string]: number;
  }>(initialAreaLevelMap);
  const [scale, setScale] = useState(1);
  const [backgroundColor, setBackgroundColor] = useState(theme.theme === "dark" ? "gray.900" : "pink.subtle");
  const rootBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const viewport = window.visualViewport;
      const width = viewport ? viewport.width : window.innerWidth;
      const height = viewport ? viewport.height : window.innerHeight;
      console.log("Window size:", width, height);
      let widthScale = (width - 50) / MAP.size[0];
      let heightScale = (height - 120) / MAP.size[1];
      setScale(Math.min(widthScale, heightScale));
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleBackgroundChange: React.MouseEventHandler<HTMLDivElement> = (e) => {
    //if (e.target == rootBoxRef.current) {
      const r = Math.floor(Math.random() * 50) + 176;
      const g = Math.floor(Math.random() * 50) + 176;
      const b = Math.floor(Math.random() * 50) + 176;
      setBackgroundColor('#' + r.toString(16) + g.toString(16) + b.toString(16));
    //}
  };

  return (
    <Flex
      ref={rootBoxRef}
      gap="2"
      direction="column"
      justify="space-between"
      width="100dvw"
      height="100dvh"
      backgroundColor={backgroundColor}
      onClick={handleBackgroundChange}
    >
      <TitleBar />
      <MapCanvas
        level={level}
        scale={scale}
        areaLevelMap={areaLevelMap}
        setAreaLevelMap={setAreaLevelMap}
      />
      <RateSelector level={level} onLevelChange={setLevel} />
      <VStack position="absolute" left="2" bottom="2">
        <ScreenshotTrigger />
        <ColorModeToggle />
      </VStack>
      <Footer />
    </Flex>
  );
};

export default App;
