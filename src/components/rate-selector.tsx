import { Box, VStack } from "@chakra-ui/react";
import { rates } from "@/constants/rates";
import { useTheme } from "next-themes";

interface RateSelectorProps {
  color: string;
  onChange: (color: string) => void;
}

const RateSelector: React.FC<RateSelectorProps> = ({ color, onChange }) => {
  const { theme } = useTheme();
  return (
    <Box position="absolute" right="2" bottom="2">
      <VStack overflowX="auto" gap={1}>
        {rates.map((item) => (
          <Box
            as="button"
            key={item.value}
            onClick={() => onChange(item.value)}
            p={1}
            border="1px solid"
            borderColor={
              color === item.value ? `${item.value}.solid` : theme === "dark" ? "#fff" : "#333"
            }
            backgroundColor={
              color === item.value
                ? `${item.value}.solid`
                : `${item.value}.subtle`
            }
            color={color === item.value ? "white" : `${item.value}.solid`}
            fontSize="sm"
          >
            {item.title}
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default RateSelector;
