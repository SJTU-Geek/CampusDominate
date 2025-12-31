import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import MapCanvas from "@/components/map-canvas";
import { Box, Button, Center, Flex, Group, Separator, Stack, Text, useChakraContext, VStack } from "@chakra-ui/react";
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
import AppTitle from "./components/app-title";
import { rgba } from "polished";
import { SettingControl } from "./components/setting-control";
import { ControlSettingContext } from "./contexts/control-setting";

const App: React.FC = () => {
  const theme = useTheme();
  const chakra = useChakraContext();
  const [scale, setScale] = useState(1);
  const [aspect, setAspect] = useState<number>(1);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(LayoutMode.Standard);
  const { bgHue, setBgHue } = useContext(ControlSettingContext);
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

  const handleBackgroundChange = () => {
    var hue = Math.random() * 360;
    setBgHue(hue);
  };

  const backgroundColor = useMemo(() => {
    if (theme.theme == 'dark') {
      return `oklch(0.3 0.03 ${bgHue})`;
    }
    else {
      return `oklch(0.96 0.02 ${bgHue})`;
    }
  }, [bgHue, theme.theme]);

  const topbarBgColor = useMemo(() => {
    if (theme.theme == 'dark') {
      return `oklch(0.3 0.01 ${(bgHue + 10) % 360})`;
    }
    else {
      return `oklch(0.96 0.05 ${(bgHue + 10) % 360})`;
    }
  }, [bgHue, theme.theme]);

  useEffect(() => {
    handleBackgroundChange();
  }, [theme.theme]);

  const navbarBgColor = useMemo(() => {
    const bgToken = theme.theme == "dark" ? "colors.gray.950" : "colors.gray.50";
    const bgValue = chakra.tokens.getByName(bgToken)?.value;
    return rgba(bgValue, theme.theme == "dark" ? 0.6 : 0.6);
  }, [theme.theme]);

  const NarrowView = () => (
    <Flex
      gap="2"
      direction="column"
      justify="space-between"
    >
      <AppTitle />
      <MapCanvas
        scale={scale}
        canvasPadding={canvasPadding}
      />
      <RateSelector/>
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
      <Flex 
        align="center"
        justify="space-between" 
        width="100%"
        gap={0}
        minHeight="80px"
        backgroundColor={topbarBgColor}
        onClick={handleBackgroundChange}
      >
        <Stack
          direction="row" 
          flex="0 1 auto"
          minWidth="280px"
        >
          <Box flex="0 1 auto" width="80px" minWidth="0px"/>
          <AppTitle flex="0 0 auto"/>
        </Stack>
        <Box flex="0 1 auto" width="20px" minWidth="0px"/>
        <Stack
          direction="row" 
          flex="0 2 auto"
          onClick={(e) => { e.stopPropagation(); }}
        >
          <Stack 
            gap={0} 
            flex="0 0 auto"
            align="center" 
            direction="row" 
            borderRadius="24px" 
            overflow="clip" 
            borderWidth={1}
            boxShadow="2px 2px 12px rgba(0, 0, 0, 0.04)"
            background={navbarBgColor}
            backdropFilter="blur(10px)"
          >
            <Group attached marginRight={4}>
              <RegionSelector pl={6}/>
              <RateSelector 
                absolute={false}
                direction="h"
              />
            </Group>
            <Separator orientation="vertical" height="6" />
            <Group attached>
              <ResetControl />
              <ShareControl pr={6} />
            </Group>
          </Stack>
          <Box flex="0 1 auto" width="80px" minWidth="0px"/>
        </Stack>
      </Flex>
      <MapCanvas
        scale={scale}
        canvasPadding={canvasPadding}
      />
      <Stack position="absolute" bottom={2} left={2} zIndex={100}>
        <ColorModeToggle />
        <SettingControl />
      </Stack>
      <Stack position="absolute" bottom={4} right={4} zIndex={100}>
        <EmojiStickerControl/>
      </Stack>
      <Footer absolute={true}/>
    </Flex>
  );

  const SquareView = () => (
    <Flex
      gap="2"
      direction="column"
      justify="space-between"
    >
      <AppTitle />
      <MapCanvas
        scale={scale}
        canvasPadding={canvasPadding}
      />
      <RateSelector />
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
      <AppTitle />
      <MapCanvas
        scale={scale}
        canvasPadding={canvasPadding}
      />
      <RateSelector />
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
      <AppTitle />
      <MapCanvas
        scale={scale}
        canvasPadding={canvasPadding}
      />
      <RateSelector />
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
