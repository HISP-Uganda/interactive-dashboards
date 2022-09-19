import { Box, Flex, Image, Text, StackProps, Stack } from "@chakra-ui/react";
import React from "react";
import { useElementSize } from "usehooks-ts";

interface HAndWAwareProps extends StackProps {}

const HAndWAware = ({ children, ...rest }: HAndWAwareProps) => {
  const [squareRef, { width, height }] = useElementSize();

  return (
    <Stack
      ref={squareRef}
      h="100%"
      align="center"
      width="100%"
      alignItems="center"
      justifyItems="center"
      justifyContent="center"
      alignContent="center"
    >
      <Stack w={`${width}px`}>{children}</Stack>
    </Stack>
  );
};

export default HAndWAware;
