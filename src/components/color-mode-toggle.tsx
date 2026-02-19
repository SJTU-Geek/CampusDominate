import { IconButton } from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { LuMoon, LuSun } from "react-icons/lu";
import { SettingControl } from "./setting-control";

interface SettingControlProps {
  rotated?: boolean;
  scale?: number;
}

export function ColorModeToggle(props: SettingControlProps) {
  const { theme, setTheme } = useTheme();
  const toggleColorMode: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    setTheme(theme === "light" ? "dark" : "light");
    e.stopPropagation();
  };
  const rotatedProps = props.rotated ? {
    transform: "rotate(90deg)",
    transformOrigin: "center center",
  } : {};
  const scaleProps = props.scale ? {
    width: `clamp(16px, calc(24px * ${props.scale}), 20px)`, 
    height: `clamp(16px, calc(24px * ${props.scale}), 20px)`
  } : {};
  console.log(scaleProps);
  return (
    <IconButton
      variant="ghost"
      aria-label="toggle color mode"
      onClick={toggleColorMode}
      {...rotatedProps}
    >
      {theme === "light" ? <LuMoon style={scaleProps}/> : <LuSun style={scaleProps}/>}
    </IconButton>
  );
}
