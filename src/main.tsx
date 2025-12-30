import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { ThemeProvider } from "next-themes"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "@/App"
import { ControlSettingContextProvider } from "./contexts/control-setting"
import { DrawStateContextProvider } from "./contexts/draw-state"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <ControlSettingContextProvider>
          <DrawStateContextProvider>
            <App />
          </DrawStateContextProvider>
        </ControlSettingContextProvider>
      </ThemeProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
