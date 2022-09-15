import { Box, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import { useElementSize } from "usehooks-ts";

const HAndWAware = ({ src }: { src: string }) => {
  const [squareRef, { width, height }] = useElementSize();

  return (
    <Flex
      ref={squareRef}
      h="100%"
      align="center"
      width="100%"
      alignItems="center"
      justifyItems="center"
      justifyContent="center"
      alignContent="center"
    >
      <Image src={src} boxSize={height} />
    </Flex>
  );
};

export default HAndWAware;
