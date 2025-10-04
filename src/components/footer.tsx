import { Box, Text } from "@chakra-ui/react";

const Footer: React.FC = () => {
  return (
    <Box as="footer" textAlign="center" py="2" mt="2">
      <Text fontSize="sm" color="gray.500">
        © {new Date().getFullYear()} 上海交通大学思源极客协会
      </Text>
    </Box>
  );
};

export default Footer;
