import { HStack, RadioCard } from "@chakra-ui/react";
import { rates } from "../constants/rates";

interface RateSelectorProps {
  color: string;
  onChange: (color: string) => void;
}

const RateSelector: React.FC<RateSelectorProps> = ({ color, onChange }) => {
  return (
    <RadioCard.Root
      defaultValue={color}
      onValueChange={(e) => e.value && onChange(e.value)}
    >
      <HStack align="stretch">
        {rates.map((item) => (
          <RadioCard.Item
            key={item.value}
            value={item.value}
            colorPalette={item.value}
          >
            <RadioCard.ItemHiddenInput />
            <RadioCard.ItemControl>
              <RadioCard.ItemIndicator />
              <RadioCard.ItemContent>
                <RadioCard.ItemText color={item.value + ".solid"}>
                  {item.title}
                </RadioCard.ItemText>
              </RadioCard.ItemContent>
            </RadioCard.ItemControl>
          </RadioCard.Item>
        ))}
      </HStack>
    </RadioCard.Root>
  );
};

export default RateSelector;
