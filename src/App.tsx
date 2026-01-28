import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import MapCanvas from "@/components/map-canvas";
import { Box, Button, Center, Flex, Group, Separator, Stack, Text, useChakraContext, VStack } from "@chakra-ui/react";
import Footer from "@/components/footer";
import { MAP } from "@/models/map-data";
import RateSelector from "@/components/rate-selector";
import { ColorModeToggle } from "@/components/color-mode-toggle";
import { useTheme } from "next-themes";
import { ShareControl,ShareControlWide } from "@/components/share-control";
import "@/styles/global.css";
import { ResetControl, ResetControlWide } from "@/components/reset-control";
import { EmojiStickerControl } from "@/components/emoji-sticker-control";
import { LayoutMode } from "./enums/layout-mode";
import { RegionSelector, RegionSelectorWide } from "./components/region-selector";
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
    // 计算宽高比并设置布局模式
    const aspect = width / height;
    let rotated = false;
    if (aspect < 3.86 / 9) {
      setLayoutMode(LayoutMode.RotateUltraWide);
      rotated = true;
    } else if (aspect < 5 / 9) {
      setLayoutMode(LayoutMode.RotateWide);
      rotated = true;
    } else if (aspect < 6.75 / 9) {
      setLayoutMode(LayoutMode.RotateStandard);
      rotated = true;
    } else if (aspect < 8 / 9) {
      setLayoutMode(LayoutMode.RotateNarrow);
      rotated = true;
    } else if (aspect < 10 / 9) {
      setLayoutMode(LayoutMode.Square);
    } else if (aspect < 12 / 9){
      setLayoutMode(LayoutMode.Narrow);
    } else if (aspect < 16 / 9) {
      setLayoutMode(LayoutMode.Standard);
    } else if (aspect < 21 / 9) {
      setLayoutMode(LayoutMode.Wide);
    } else {
      setLayoutMode(LayoutMode.UltraWide);
    }
    setAspect(aspect);    
    
    let longerLength = width;
    let shorterLength = height;
    if (rotated) {
      longerLength = height;
      shorterLength = width;
    }
    let widthScale = (longerLength - 40) / (MAP.size[0] + canvasPadding * 2);
    let heightScale = (shorterLength - 100) / (MAP.size[1] + canvasPadding * 2);
    setScale(Math.min(widthScale, heightScale));
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
            <RegionSelector pl={6}/>
            <Group attached>
              <ResetControl pl={4}/>
              <ShareControl pr={4}/>
            </Group>
          </Stack>
          <Box flex="0 1 auto" width="80px" minWidth="0px"/>
        </Stack>
      </Flex>
      <RateSelector 
        absolute={false}
        wrap={true}
        direction="h"
        alignSelf="center"
        margin="12px 0px"
      />
      <MapCanvas
        scale={scale}
        canvasPadding={canvasPadding}
        align="flex-start"
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
            <RegionSelector pl={6}/>
            <Group attached>
              <ResetControl pl={4}/>
              <ShareControl pr={4}/>
            </Group>
          </Stack>
          <Box flex="0 1 auto" width="80px" minWidth="0px"/>
        </Stack>
      </Flex>
      <RateSelector 
        absolute={false}
        wrap={true}
        direction="h"
        alignSelf="center"
        margin="12px 0px"
      />
      <MapCanvas
        scale={scale}
        canvasPadding={canvasPadding}
        align="flex-start"
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

  const WideView = () => (
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

  const UltraWideView = () => (
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

  const RotateNarrowView = () => (
    <Flex
      gap="2"
      direction="row-reverse"
      justify="space-between"
      align="center"
      width="100%"
      height="100%"
    >
      <Flex 
        align="center"
        justify="space-between" 
        flexDirection="column"
        height="100%"
        gap={0}
        width="80px"
        backgroundColor={topbarBgColor}
        onClick={handleBackgroundChange}
      >
        <Box flex="0 1 auto" width="20px" height="20px" minHeight="0px"/>
        <Center flex="0 1 auto" minHeight="280px" width="100%" gap={0}>
          <Box
            transform="rotate(90deg)"
            transformOrigin="center center"
            textAlign="center"
            whiteSpace="nowrap"
          >
            <AppTitle flex="0 0 auto"/>
          </Box>
        </Center>
        <Box flex="0 1 auto" width="20px" height="20px" minHeight="0px"/>
        <Center flex="0 1 auto" minHeight="304px" width="100%" gap={0}>
          <Stack
            direction="row" 
            flex="0 2 auto"
            onClick={(e) => { e.stopPropagation(); }}
            transform="rotate(90deg)"
            transformOrigin="center center"
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
              <RegionSelector pl={6} rotated={true}/>
              <Group attached>
                <ResetControl pl={4} rotated={true}/>
                <ShareControl pr={4}/>
              </Group>
            </Stack>
          </Stack>
        </Center>
        <Box flex="0 1 auto" width="20px" height="20px" minHeight="0px"/>
      </Flex>
      <Center 
        width="60px" 
        height={0} 
        transform="rotate(90deg)"
        transformOrigin="center center"
      >
        <RateSelector 
          absolute={false}
          wrap={true}
          direction="h"
          alignSelf="center"
          margin="12px 0px"
        />
      </Center>
      <MapCanvas
        scale={scale}
        canvasPadding={canvasPadding}
        rotated={true}
        align="flex-start"
      />
      <Stack position="absolute" top={2} left={2} direction="row-reverse" zIndex={100}>
        <ColorModeToggle />
        <SettingControl rotated={true}/>
      </Stack>
      <Stack position="absolute" bottom={4} left={4} zIndex={100}>
        <EmojiStickerControl rotated={true}/>
      </Stack>
      <Footer absolute={true} rotated={true}/>
    </Flex>
  );

  const RotateStandardView = () => (
    <Flex
      gap="2"
      direction="row-reverse"
      justify="space-between"
      align="center"
      width="100%"
      height="100%"
    >
      <Flex 
        align="center"
        justify="space-between" 
        flexDirection="column"
        height="100%"
        gap={0}
        width="80px"
        backgroundColor={topbarBgColor}
        onClick={handleBackgroundChange}
      >
        <Box flex="0 1 auto" width="20px" height="20px" minHeight="0px"/>
        <Center flex="0 1 auto" minHeight="280px" width="100%" gap={0}>
          <Box
            transform="rotate(90deg)"
            transformOrigin="center center"
            textAlign="center"
            whiteSpace="nowrap"
          >
            <AppTitle flex="0 0 auto"/>
          </Box>
        </Center>
        <Box flex="0 1 auto" width="20px" height="20px" minHeight="0px"/>
        <Center flex="0 1 auto" minHeight="740px" width="100%" gap={0}>
          <Stack
            direction="row" 
            flex="0 2 auto"
            onClick={(e) => { e.stopPropagation(); }}
            transform="rotate(90deg)"
            transformOrigin="center center"
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
              <RegionSelector pl={6} rotated={true}/>
              <RateSelector 
                absolute={false}
                wrap={false}
                direction="h"
                alignSelf="center"
              />
              <Group attached>
                <ResetControl pl={4} rotated={true}/>
                <ShareControl pr={4}/>
              </Group>
            </Stack>
          </Stack>
        </Center>
        <Box flex="0 1 auto" width="20px" height="20px" minHeight="0px"/>
      </Flex>
      <MapCanvas
        scale={scale}
        canvasPadding={canvasPadding}
        rotated={true}
        align="flex-start"
      />
      <Stack position="absolute" top={2} left={2} direction="row-reverse" zIndex={100}>
        <ColorModeToggle />
        <SettingControl rotated={true}/>
      </Stack>
      <Stack position="absolute" bottom={4} left={4} zIndex={100}>
        <EmojiStickerControl rotated={true}/>
      </Stack>
      <Footer absolute={true} rotated={true}/>
    </Flex>
  );

  const RotateWideView = () => (
    <Flex
      gap="2"
      direction="row-reverse"
      justify="space-between"
      align="center"
      width="100%"
      height="100%"
    >
      <Flex 
        align="center"
        justify="space-between" 
        flexDirection="column"
        height="100%"
        gap={0}
        width="80px"
        backgroundColor={topbarBgColor}
        onClick={handleBackgroundChange}
      >
        <Box flex="0 1 auto" width="20px" height="20px" minHeight="0px"/>
        <Center flex="0 1 auto" minHeight="280px" width="100%" gap={0}>
          <Box
            transform="rotate(90deg)"
            transformOrigin="center center"
            textAlign="center"
            whiteSpace="nowrap"
          >
            <AppTitle flex="0 0 auto"/>
          </Box>
        </Center>
        <Box flex="0 1 auto" width="20px" height="20px" minHeight="0px"/>
        <Center flex="0 1 auto" minHeight="740px" width="100%" gap={0}>
          <Stack
            direction="row" 
            flex="0 2 auto"
            onClick={(e) => { e.stopPropagation(); }}
            transform="rotate(90deg)"
            transformOrigin="center center"
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
              <RateSelector 
                absolute={false}
                wrap={false}
                direction="h"
                alignSelf="center"
              />
            </Stack>
          </Stack>
        </Center>
        <Box flex="0 1 auto" width="20px" height="20px" minHeight="0px"/>
      </Flex>
      <MapCanvas
        scale={scale}
        canvasPadding={canvasPadding}
        rotated={true}
        align="flex-start"
      />
      <Stack position="absolute" top={2} left={2} direction="row-reverse" zIndex={100}>
        <RegionSelectorWide rotated={true}/>
        <ResetControlWide rotated={true}/>
        <ShareControlWide rotated={true}/>
        <ColorModeToggle />
        <SettingControl rotated={true}/>
      </Stack>
      <Stack position="absolute" bottom={4} left={4} zIndex={100}>
        <EmojiStickerControl rotated={true}/>
      </Stack>
      <Footer absolute={true} rotated={true}/>
    </Flex>
  );

  const RotateUltraWideView = () => (
    <Flex
      gap="2"
      direction="row-reverse"
      justify="space-between"
      align="center"
      width="100%"
      height="100%"
    >
      <Flex 
        align="center"
        justify="space-between" 
        flexDirection="column"
        height="100%"
        gap={0}
        width="80px"
        backgroundColor={topbarBgColor}
        onClick={handleBackgroundChange}
      >
        <Box flex="0 1 auto" width="20px" height="20px" minHeight="0px"/>
        <Center flex="0 1 auto" minHeight="280px" width="100%" gap={0}>
          <Box
            transform="rotate(90deg)"
            transformOrigin="center center"
            textAlign="center"
            whiteSpace="nowrap"
          >
            <AppTitle flex="0 0 auto"/>
          </Box>
        </Center>
        <Box flex="0 1 auto" width="20px" height="20px" minHeight="0px"/>
        <Center flex="0 1 auto" minHeight="740px" width="100%" gap={0}>
          <Stack
            direction="row" 
            flex="0 2 auto"
            onClick={(e) => { e.stopPropagation(); }}
            transform="rotate(90deg)"
            transformOrigin="center center"
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
              <RegionSelector pl={6} rotated={true}/>
              <RateSelector 
                absolute={false}
                wrap={false}
                direction="h"
                alignSelf="center"
              />
              <Group attached>
                <ResetControl pl={4} rotated={true}/>
                <ShareControl pr={4}/>
              </Group>
            </Stack>
          </Stack>
        </Center>
        <Box flex="0 1 auto" width="20px" height="20px" minHeight="0px"/>
      </Flex>
      <MapCanvas
        scale={scale}
        canvasPadding={canvasPadding}
        rotated={true}
        align="flex-start"
      />
      <Stack position="absolute" top={2} left={2} direction="row-reverse" zIndex={100}>
        <ColorModeToggle />
        <SettingControl rotated={true}/>
      </Stack>
      <Stack position="absolute" bottom={4} left={4} zIndex={100}>
        <EmojiStickerControl rotated={true}/>
      </Stack>
      <Footer absolute={true} rotated={true}/>
    </Flex>
  );

  return (
    <Box
      ref={rootBoxRef}
      width="100dvw"
      height="100dvh"
      overflowY="hidden"
      overflowX="hidden"
      backgroundColor={backgroundColor}
    >
      {
        (() => {
          switch (layoutMode) {
            case LayoutMode.RotateNarrow:
              return <RotateNarrowView />;
            case LayoutMode.RotateStandard:
              return <RotateStandardView />;
            case LayoutMode.RotateWide:
              return <RotateWideView />;
            case LayoutMode.RotateUltraWide:
              return <RotateUltraWideView />;
            case LayoutMode.Square:
              return <SquareView />;
            case LayoutMode.Narrow:
              return <NarrowView />;
            case LayoutMode.Standard:
              return <StandardView />;
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
