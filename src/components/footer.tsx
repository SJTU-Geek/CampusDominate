import { Box, Text } from "@chakra-ui/react";

interface FooterProps {
  absolute?: boolean;
  rotated?: boolean;
}

const Footer: React.FC<FooterProps> = (props: FooterProps) => {
  const absoluteProps = props.absolute ? {
    position: "absolute",
    bottom: "4px",
    width: "100%"
  } : {};
  const rotatedProps = props.rotated ? {
    position: "absolute",
    left: "4px",
    top: "50%",
    height: "1rem",
    width: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center", 
    transform: "rotate(90deg)",
    transformOrigin: "center center",
  } : {};
  return (
    <Box 
      as="footer" 
      textAlign="center" 
      whiteSpace="nowrap" 
      py="2" 
      {...absoluteProps}
      {...rotatedProps}
    >
      <Text fontSize="sm" color="gray.500">
        © {new Date().getFullYear()} 上海交通大学思源极客协会
      </Text>
    </Box>
  );
};

export default Footer;
