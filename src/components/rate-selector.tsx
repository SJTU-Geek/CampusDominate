import React, { useContext } from "react";
import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import { LEVELS } from "@/constants/rates";
import { ControlSettingContext } from "@/contexts/control-setting";

interface RateSelectorProps {
  absolute?: boolean;
  wrap?: boolean;
  direction?: "v" | "h";
  alignSelf?: string;
  margin?: string;
  scale: number;
}

const RateSelector: React.FC<RateSelectorProps> = ({ ...props } = {
  absolute: true,
  wrap: false,
  direction: "v",
  scale: 1,
}) => {
  const { setSelectedEmoji, level, setLevel } = useContext(ControlSettingContext);
  const absoluteProps = props.absolute ? {
    position: "absolute",
    right: "2",
    bottom: "2"
  } : {};

  return (
    <Box {...absoluteProps} alignSelf={props.alignSelf} margin={props.margin} height={"100%"}>
      <ButtonGroup height="100%" flexDirection={props.direction == "h" ? "row" : "column"} variant="outline" attached>
        {LEVELS.map((item, index) => (
          <Button
            key={item.color}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedEmoji(null);
              setLevel(index);
            }}
            height="100%"
            border="4px solid"
            borderColor={
              level === index ? `${item.color}.600` : "transparent"
            }
            backgroundColor={
              level === index
                ? `${item.color}.500`
                : `${item.color}.subtle`
            }
            color={level === index ? "white" : `${item.color}.solid`}
            fontSize={`clamp(8px, calc(20px * ${props.scale}), 16px)`}
            px={`clamp(0px, calc(1rem * (${props.scale} - 0.5)), 0.5rem)`}
            py={props.wrap ? `clamp(0px, calc(0.4rem * ${props.scale}), 0.5rem)` : "0px"}
            borderRadius="none"
          >
            {props.wrap ? (
              <Box as="span" display="inline-block" textAlign="center" lineHeight={`clamp(0.8rem, calc(1.6rem * ${props.scale}), 1.2rem)`}>
                {item.title.slice(0,2)}
                <br />
                {item.title.slice(2)}
              </Box>
            ) : item.title}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default RateSelector;
