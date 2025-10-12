import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { ThemeProvider } from "next-themes"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "@/App"
import { LevelMapContextProvider } from "@/contexts/level-map"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <LevelMapContextProvider>
          <App />
        </LevelMapContextProvider>
      </ThemeProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
