import { Box, Stack, Text } from "@chakra-ui/react";

import { chakraComponents, GroupBase, OptionProps } from "chakra-react-select";
import { Option } from "../interfaces";
export const customComponents = {
  Option: ({
    children,
    ...props
  }: OptionProps<Option, false, GroupBase<Option>>) => (
    <chakraComponents.Option {...props}>
      <Stack w="100%" spacing={0}>
        <Text>{children}</Text>
        <Stack w="100%" direction="row" spacing="0">
          {props.data.value.split(",").map((c) => (
            <Box bg={c} key={c} w="100%">
            </Box>
          ))}
        </Stack>
      </Stack>
    </chakraComponents.Option>
  ),
};
