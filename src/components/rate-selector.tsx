import { Box, Button, VStack } from "@chakra-ui/react";
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
      <VStack overflowX="auto" gap={1}>
        {LEVELS.map((item, index) => (
          <Button
            key={item.color}
            onClick={() => onLevelChange(index)}
            p={1}
            border="1.5px solid"
            borderColor={
              level === index ? `${item.color}.solid` : theme === "dark" ? "#fff" : "#333"
            }
            backgroundColor={
              level === index
                ? `${item.color}.solid`
                : `${item.color}.subtle`
            }
            color={level === index ? "white" : `${item.color}.solid`}
            fontSize="sm"
            borderRadius="none"
          >
            {item.title}
          </Button>
        ))}
      </VStack>
    </Box>
  );
};

export default RateSelector;
