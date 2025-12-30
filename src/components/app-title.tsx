import { Heading, Highlight, Center, Strong } from "@chakra-ui/react";

const AppTitle: React.FC = () => {
  return (
    <Heading lineHeight="tall" fontWeight={500} fontSize={40} fontFamily="LXGW Marker Gothic">
      SJTU 校园<Strong>制霸</Strong>
    </Heading>
  );
};

export default AppTitle;
