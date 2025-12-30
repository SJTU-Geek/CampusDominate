import { REGIONS } from "@/constants/regions";
import { Portal, Select, createListCollection } from "@chakra-ui/react";
import { useState } from "react";

export interface RegionSelectorProps {
  region: string;
  setRegion: React.Dispatch<React.SetStateAction<string>>;
}

const regions = createListCollection({
  items: REGIONS.map(r => ({
    label: r.name,
    value: r.id
  })),
})

export const RegionSelector = (props: RegionSelectorProps) => {
  const [value, setValue] = useState<string[]>([]);
  console.log(value)
  return (
    <Select.Root
      collection={regions}
      width="120px"
      variant="subtle"
      value={value}
      onValueChange={(e) => setValue(e.value)}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="请选择校区" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {regions.items.map((region) => (
              <Select.Item item={region} key={region.value}>
                {region.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}