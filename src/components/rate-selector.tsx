import { Box, Button, ButtonGroup, VStack } from "@chakra-ui/react";
import { LEVELS } from "@/constants/rates";
import { useTheme } from "next-themes";

interface RateSelectorProps {
  level: number;
  onLevelChange: (color: number) => void;
}

const RateSelector: React.FC<RateSelectorProps> = ({ level, onLevelChange }) => {
  const { theme } = useTheme();
  return (
    <Box position="absolute" right="2" bottom="2">
      <ButtonGroup size="lg" flexDirection="column" variant="outline" attached>
        {LEVELS.map((item, index) => (
          <Button
            key={item.color}
            onClick={(e) => {
              e.stopPropagation();
              onLevelChange(index);
            }}
            p={1}
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
            fontSize="sm"
            borderRadius="none"
          >
            {item.title}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default RateSelector;
