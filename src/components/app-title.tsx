import { Heading, Highlight, Center, Strong, HeadingProps } from "@chakra-ui/react";

const AppTitle: React.FC<HeadingProps> = (props: HeadingProps) => {
  return (
    <Heading 
      lineHeight="tall" 
      fontWeight={500} 
      fontSize={40} 
      fontFamily="LXGW Marker Gothic"
      {...props}
    >
      SJTU 校园<Strong>制霸</Strong>
    </Heading>
  );
};

export default AppTitle;
