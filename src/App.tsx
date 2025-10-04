import React, { useState } from "react";
import MapCanvas from "./components/map-canvas";
import {  Flex } from "@chakra-ui/react";
import TitleBar from "./components/titlebar";
import { rates } from "./constants/rates";
import Footer from "./components/footer";

const App: React.FC = () => {
  const [color, setColor] = useState(rates[0].value);
  const [selectedColors, setSelectedColors] = useState<{
    [name: string]: string;
  }>({});

  return (
    <Flex gap="2" direction="column" justify="space-between">
      <TitleBar color={color} onColorChange={setColor} />
      <MapCanvas
        color={color}
        selectedColors={selectedColors}
        setSelectedColors={setSelectedColors}
      />
      <Footer />
    </Flex>
  );
};

export default App;
