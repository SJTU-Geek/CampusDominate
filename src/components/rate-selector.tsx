import React, { useContext } from "react";
import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import { LEVELS } from "@/constants/rates";
import { ControlSettingContext } from "@/contexts/control-setting";

interface RateSelectorProps {
  level: number;
  onLevelChange: (color: number) => void;
  absolute: boolean;
  direction: "v" | "h";
}

const RateSelector: React.FC<RateSelectorProps> = ({ level, onLevelChange, ...props }) => {
  const { setSelectedEmoji } = useContext(ControlSettingContext);
  const absoluteProps = props.absolute ? {
    position: "absolute",
    right: "2",
    bottom: "2"
  } : {};

  return (
    <Box {...absoluteProps}>
      <ButtonGroup size="lg" flexDirection={props.direction == "h" ? "row" : "column"} variant="outline" attached>
        {LEVELS.map((item, index) => (
          <Button
            key={item.color}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedEmoji(null);
              onLevelChange(index);
            }}
            p={1}
            height="auto"
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
            fontSize="md"
            padding="4px 8px"
            borderRadius="none"
          >
            {props.direction == "h" ? (
              <Box as="span" display="inline-block" textAlign="center" lineHeight="1.2rem">
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
