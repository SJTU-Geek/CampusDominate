import { REGIONS } from "@/constants/regions";
import { ControlSettingContext } from "@/contexts/control-setting";
import { Portal, Select, createListCollection } from "@chakra-ui/react";
import { useContext, useState } from "react";

const regions = createListCollection({
  items: REGIONS.map(r => ({
    label: r.name,
    value: r.id
  })),
})

interface RegionSelectorProps {
  pl?: number;
}

export const RegionSelector = (props: RegionSelectorProps = {
  pl: undefined
}) => {
  const { region, setRegion } = useContext(ControlSettingContext);
  return (
    <Select.Root
      collection={regions}
      width="130px"
      value={[region]}
      onValueChange={(e) => setRegion(e.value[0])}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger paddingLeft={props.pl} fontSize={16} borderWidth="0">
          <Select.ValueText placeholder="请选择校区" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner >
          <Select.Content 
            transform="rotate(90deg)"
            transformOrigin="center center">
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