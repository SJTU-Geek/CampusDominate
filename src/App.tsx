import React, { useCallback, useEffect, useRef, useState } from "react";
import MapCanvas from "@/components/map-canvas";
import { Flex, VStack } from "@chakra-ui/react";
import TitleBar from "@/components/titlebar";
import Footer from "@/components/footer";
import { MAP } from "@/models/map-data";
import RateSelector from "@/components/rate-selector";
import { ColorModeToggle } from "@/components/color-mode-toggle";
import { useTheme } from "next-themes";
import { ScreenshotTrigger } from "@/components/screenshot-trigger";
import "@/styles/global.css";
import { ResetControl } from "@/components/reset-control";
import { EmojiStickerControl } from "@/components/emoji-sticker-control";

const App: React.FC = () => {
  const theme = useTheme();
  const [level, setLevel] = useState(0);
  const [scale, setScale] = useState(1);
  const [backgroundColor, setBackgroundColor] = useState(theme.theme === "dark" ? "gray.900" : "pink.subtle");
  const rootBoxRef = useRef<HTMLDivElement>(null);
  const canvasPadding = 2;

  useEffect(() => {
    const handleResize = () => {
      const viewport = window.visualViewport;
      const width = viewport ? viewport.width : window.innerWidth;
      const height = viewport ? viewport.height : window.innerHeight;
      let widthScale = (width - 50) / (MAP.size[0] + canvasPadding * 2);
      let heightScale = (height - 120) / (MAP.size[1] + canvasPadding * 2);
      setScale(Math.min(widthScale, heightScale));
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleBackgroundChange = useCallback(() => {
    //if (e.target == rootBoxRef.current) {
    if (theme.theme == 'dark') {
      const r = Math.floor(Math.random() * 40) + 10;
      const g = Math.floor(Math.random() * 40) + 10;
      const b = Math.floor(Math.random() * 40) + 10;
      setBackgroundColor('#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0'));
    }
    else {
      const r = Math.floor(Math.random() * 50) + 176;
      const g = Math.floor(Math.random() * 50) + 176;
      const b = Math.floor(Math.random() * 50) + 176;
      setBackgroundColor('#' + r.toString(16) + g.toString(16) + b.toString(16));
    }
  }, [theme.theme]);

  useEffect(() => {
    handleBackgroundChange();
  }, [theme.theme])

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
        canvasPadding={canvasPadding}
      />
      <RateSelector level={level} onLevelChange={setLevel} />
      <VStack position="absolute" left="2" bottom="2">
        <ScreenshotTrigger />
        <EmojiStickerControl />
        <ColorModeToggle />
        <ResetControl />
      </VStack>
      <Footer />
    </Flex>
  );
};

export default App;
