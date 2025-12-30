import React, { useCallback, useEffect, useRef, useState } from "react";
import MapCanvas from "@/components/map-canvas";
import { Box, Button, Center, Flex, Text, VStack } from "@chakra-ui/react";
import TitleBar from "@/components/titlebar";
import Footer from "@/components/footer";
import { MAP } from "@/models/map-data";
import RateSelector from "@/components/rate-selector";
import { ColorModeToggle } from "@/components/color-mode-toggle";
import { useTheme } from "next-themes";
import { ShareControl } from "@/components/share-control";
import "@/styles/global.css";
import { ResetControl } from "@/components/reset-control";
import { EmojiStickerControl } from "@/components/emoji-sticker-control";
import { LayoutMode } from "./enums/layout-mode";
import { RegionSelector } from "./components/region-selector";

const App: React.FC = () => {
  const theme = useTheme();
  const [level, setLevel] = useState(0);
  const [scale, setScale] = useState(1);
  const [aspect, setAspect] = useState<number>(1);
  const [backgroundColor, setBackgroundColor] = useState(theme.theme === "dark" ? "gray.900" : "pink.subtle");
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(LayoutMode.Standard);
  const rootBoxRef = useRef<HTMLDivElement>(null);
  const canvasPadding = 2;

  const handleResize = () => {
    const viewport = window.visualViewport;
    const width = viewport ? viewport.width : window.innerWidth;
    const height = viewport ? viewport.height : window.innerHeight;
    let widthScale = (width - 50) / (MAP.size[0] + canvasPadding * 2);
    let heightScale = (height - 120) / (MAP.size[1] + canvasPadding * 2);
    setScale(Math.min(widthScale, heightScale));

    // 计算宽高比并设置布局模式
    const aspect = width / height;
    if (aspect < 12 / 9) {
      setLayoutMode(LayoutMode.Narrow);
    } else if (aspect < 16 / 9) {
      setLayoutMode(LayoutMode.Standard);
    } else if (aspect < 21 / 9) {
      setLayoutMode(LayoutMode.Wide);
    } else {
      setLayoutMode(LayoutMode.UltraWide);
    }
    setAspect(aspect);
  };

  useEffect(() => {
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
  }, [theme.theme]);

  const NarrowView = () => (
    <Flex
      gap="2"
      direction="column"
      justify="space-between"
    >
      <TitleBar />
      <MapCanvas
        level={level}
        scale={scale}
        canvasPadding={canvasPadding}
      />
      <RateSelector level={level} onLevelChange={setLevel} />
      <VStack position="absolute" left="2" bottom="2">
        <ShareControl />
        <EmojiStickerControl />
        <ColorModeToggle />
        <ResetControl />
      </VStack>
      <Footer />
    </Flex>
  );

  const StandardView = () => (
    <Flex
      gap="2"
      direction="column"
      justify="space-between"
      height="100%"
    >
      <Center gap={12} onClick={(e) => { e.stopPropagation(); }}>
        <TitleBar />
        <RegionSelector />
        <RateSelector 
          level={level} 
          onLevelChange={setLevel} 
          absolute={false}
          direction="h"
        />
        <EmojiStickerControl/>
        <ResetControl />
        <ShareControl />
      </Center>
      <MapCanvas
        level={level}
        scale={scale}
        canvasPadding={canvasPadding}
      />
      <Footer absolute={true}/>
    </Flex>
  );

  const SquareView = () => (
    <Flex
      gap="2"
      direction="column"
      justify="space-between"
    >
      <TitleBar />
      <MapCanvas
        level={level}
        scale={scale}
        canvasPadding={canvasPadding}
      />
      <RateSelector level={level} onLevelChange={setLevel} />
      <VStack position="absolute" left="2" bottom="2">
        <ShareControl />
        <EmojiStickerControl />
        <ColorModeToggle />
        <ResetControl />
      </VStack>
      <Footer />
    </Flex>
  );

  const WideView = () => (
    <Flex
      gap="2"
      direction="column"
      justify="space-between"
    >
      <TitleBar />
      <MapCanvas
        level={level}
        scale={scale}
        canvasPadding={canvasPadding}
      />
      <RateSelector level={level} onLevelChange={setLevel} />
      <VStack position="absolute" left="2" bottom="2">
        <ShareControl />
        <EmojiStickerControl />
        <ColorModeToggle />
        <ResetControl />
      </VStack>
      <Footer />
    </Flex>
  );

  const UltraWideView = () => (
    <Flex
      gap="2"
      direction="column"
      justify="space-between"
    >
      <TitleBar />
      <MapCanvas
        level={level}
        scale={scale}
        canvasPadding={canvasPadding}
      />
      <RateSelector level={level} onLevelChange={setLevel} />
      <VStack position="absolute" left="2" bottom="2">
        <ShareControl />
        <EmojiStickerControl />
        <ColorModeToggle />
        <ResetControl />
      </VStack>
      <Footer />
    </Flex>
  );

  return (
    <Box
      ref={rootBoxRef}
      width="100dvw"
      height="100dvh"
      backgroundColor={backgroundColor}
      onClick={handleBackgroundChange}
    >
      {
        (() => {
          switch (layoutMode) {
            case LayoutMode.Narrow:
              return <NarrowView />;
            case LayoutMode.Standard:
              return <StandardView />;
            case LayoutMode.Square:
              return <SquareView />;
            case LayoutMode.Wide:
              return <WideView />;
            case LayoutMode.UltraWide:
              return <UltraWideView />;
          }
        })()
      }
      <Text position={'absolute'} top={0}>Layout: {layoutMode.toString()} ({(aspect*9).toFixed(2)}):9</Text>
    </Box>
  );
};

export default App;
