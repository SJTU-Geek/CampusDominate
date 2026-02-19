import { Heading, Highlight, Center, Strong, HeadingProps } from "@chakra-ui/react";

interface AppTitleProps {
  fontScale: number;
}

const AppTitle: React.FC<AppTitleProps & HeadingProps> = (props: AppTitleProps & HeadingProps) => {
  return (
    <Heading 
      lineHeight="tall" 
      fontWeight={500} 
      fontSize={`clamp(0.2rem, calc(2rem * ${props.fontScale}), 2.5rem)`}
      fontFamily="LXGW Marker Gothic"
      {...props}
    >
      SJTU 校园<Strong>制霸</Strong>
    </Heading>
  );
};

export default AppTitle;
