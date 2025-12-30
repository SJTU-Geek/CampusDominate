import { Box, Text } from "@chakra-ui/react";

interface FooterProps {
  absolute?: boolean;
}

const Footer: React.FC<FooterProps> = (props: FooterProps) => {
  const absoluteProps = props.absolute ? {
    position: "absolute",
    bottom: "4px",
    width: "100%"
  } : {};
  return (
    <Box as="footer" textAlign="center" py="2" {...absoluteProps}>
      <Text fontSize="sm" color="gray.500">
        © {new Date().getFullYear()} 上海交通大学思源极客协会
      </Text>
    </Box>
  );
};

export default Footer;
