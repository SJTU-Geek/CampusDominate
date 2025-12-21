import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { ThemeProvider } from "next-themes"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "@/App"
import { LevelMapContextProvider } from "@/contexts/level-map"
import { EmojiStickerContextProvider } from "@/contexts/emoji-stickers"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <LevelMapContextProvider>
          <EmojiStickerContextProvider>
            <App />
          </EmojiStickerContextProvider>
        </LevelMapContextProvider>
      </ThemeProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
