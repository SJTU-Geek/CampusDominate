import { IconButton } from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { LuMoon, LuSun } from "react-icons/lu";

export function ColorModeToggle() {
  const { theme, setTheme } = useTheme();
  const toggleColorMode: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    setTheme(theme === "light" ? "dark" : "light");
    e.stopPropagation();
  };
  return (
    <IconButton
      variant="ghost"
      aria-label="toggle color mode"
      onClick={toggleColorMode}
    >
      {theme === "light" ? <LuMoon /> : <LuSun />}
    </IconButton>
  );
}
