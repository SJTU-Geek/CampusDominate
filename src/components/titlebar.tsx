import { Heading, Highlight, Center } from "@chakra-ui/react";

const TitleBar: React.FC = () => {
  return (
    <Center gap={2}>
      <Heading lineHeight="tall" fontSize="xl">
        <Highlight
          query="制霸"
          styles={{ px: "0.5", bg: "orange.subtle", color: "orange.fg" }}
        >
          SJTU 校园制霸
        </Highlight>
      </Heading>
    </Center>
  );
};

export default TitleBar;
