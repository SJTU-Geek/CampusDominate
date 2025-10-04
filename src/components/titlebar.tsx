import { Card, Heading, HStack, Highlight, Flex } from "@chakra-ui/react";
import RateSelector from "./rate-selector";
import { ColorModeToggle } from "./color-mode-toggle";

interface TitleBarProps {
  color: string;
  onColorChange: (color: string) => void;
};

const TitleBar: React.FC<TitleBarProps> = ({ color, onColorChange }) => {
  return (
    <Card.Root p="4" boxShadow="md" m="4" borderRadius="xl">
      <Flex justify="space-between" align="center">
        <Heading lineHeight="tall" fontSize="2xl">
          <Highlight
            query="制霸"
            styles={{ px: "0.5", bg: "orange.subtle", color: "orange.fg" }}
          >
            SJTU 校园制霸
          </Highlight>
        </Heading>
        <RateSelector color={color} onChange={onColorChange} />
        <ColorModeToggle />
      </Flex>
    </Card.Root>
  );
};

export default TitleBar;
