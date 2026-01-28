import { REGIONS } from "@/constants/regions";
import { ControlSettingContext } from "@/contexts/control-setting";
import { Portal, Select, createListCollection,useSelectContext } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IconButton } from "@chakra-ui/react";

const regions = createListCollection({
  items: REGIONS.map(r => ({
    label: r.name,
    value: r.id
  })),
})

interface RegionSelectorProps {
  pl?: number;
  rotated?: boolean;
}

export const RegionSelector = (props: RegionSelectorProps) => {
  const { region, setRegion } = useContext(ControlSettingContext);
  const rotatedProps = props.rotated ? {
    transform: "rotate(90deg)",
    transformOrigin: "center center",
  } : {};
  return (
    <Select.Root
      collection={regions}
      width="130px"
      value={[region]}
      onValueChange={(e) => setRegion(e.value[0])}
      positioning={{ placement: props.rotated ? "left" : "top" }}
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
        <Select.Positioner>
          <Select.Content 
            {...rotatedProps}>
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

export const RegionSelectorWide = (props: RegionSelectorProps) => {
  const SelectTrigger = () => {
    const select =useSelectContext()
    return (
      <IconButton
      {...select.getTriggerProps()}
        onClick={(e) => {
          e.stopPropagation();
          select.getTriggerProps().onClick?.(e)
        }}
        variant="ghost"
        padding="4px 12px"
        px="2"
        size="sm"
      >
        <FaMapMarkerAlt size={"20px"} />
      </IconButton>
    )
  }
  const { region, setRegion } = useContext(ControlSettingContext);
  const rotatedProps = props.rotated ? {
    transform: "rotate(90deg)",
    transformOrigin: "center center",
  } : {};
  return (
    <Select.Root
      collection={regions}
      value={[region]}
      onValueChange={(e) => setRegion(e.value[0])}
      positioning={{ 
        placement: props.rotated ? "bottom" : "right", 
        offset:{mainAxis: props.rotated?40:10}
      }}
      placeItems={"center"}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <SelectTrigger/>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content 
            {...rotatedProps}>
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