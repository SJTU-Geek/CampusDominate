import React, { useEffect, useState } from "react";
import MapCanvas from "@/components/map-canvas";
import { Flex, VStack } from "@chakra-ui/react";
import TitleBar from "@/components/titlebar";
import { rates } from "@/constants/rates";
import Footer from "@/components/footer";
import { MAP } from "@/models/map-data";
import RateSelector from "@/components/rate-selector";
import { ColorModeToggle } from "@/components/color-mode-toggle";
import { useTheme } from "next-themes";
import { ScreenshotTrigger } from "./components/screenshot-trigger";

const App: React.FC = () => {
  const theme = useTheme();
  const [color, setColor] = useState(rates[0].value);
  const [selectedColors, setSelectedColors] = useState<{
    [name: string]: string;
  }>({});
  const [scale, setScale] = useState(1);

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

  return (
    <Flex
      gap="2"
      direction="column"
      justify="space-between"
      width="100dvw"
      height="100dvh"
      backgroundColor={theme.theme === "dark" ? "gray.900" : "pink.subtle"}
    >
      <TitleBar />
      <MapCanvas
        color={color}
        scale={scale}
        selectedColors={selectedColors}
        setSelectedColors={setSelectedColors}
      />
      <RateSelector color={color} onChange={setColor} />
      <VStack position="absolute" left="2" bottom="2">
        <ScreenshotTrigger />
        <ColorModeToggle />
      </VStack>
      <Footer />
    </Flex>
  );
};

export default App;
