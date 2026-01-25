import { IconButton } from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { LuMoon, LuSun } from "react-icons/lu";
import { SettingControl } from "./setting-control";

interface SettingControlProps {
  rotated?: boolean;
}

export function ColorModeToggle(props:SettingControlProps) {
  const { theme, setTheme } = useTheme();
  const toggleColorMode: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    setTheme(theme === "light" ? "dark" : "light");
    e.stopPropagation();
  };
  const rotatedProps = props.rotated ? {
    transform: "rotate(90deg)",
    transformOrigin: "center center",
} : {};
  return (
    <IconButton
      variant="ghost"
      aria-label="toggle color mode"
      onClick={toggleColorMode}
      {...rotatedProps}
    >
      {theme === "light" ? <LuMoon /> : <LuSun />}
    </IconButton>
  );
}
