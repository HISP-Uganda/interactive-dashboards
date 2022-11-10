import { Spinner, Stack, Text } from "@chakra-ui/react";

import { useMatch } from "@tanstack/react-location";
import { LocationGenerics } from "../../interfaces";
import { useCategory } from "../../Queries";
import { generalPadding, otherHeight } from "../constants";
import Category from "./Category";
export default function CategoryForm() {
  const {
    params: { categoryId },
  } = useMatch<LocationGenerics>();
  console.log(categoryId);
  const { isLoading, isSuccess, isError, error } = useCategory(categoryId);
  return (
    <Stack
      p={`${generalPadding}px`}
      bgColor="white"
      flex={1}
      h={otherHeight}
      maxH={otherHeight}
      justifyContent="center"
      justifyItems="center"
      alignContent="center"
      alignItems="center"
      w="100%"
    >
      {isLoading && <Spinner />}
      {isSuccess && <Category />}
      {isError && <pre>{JSON.stringify(error)}</pre>}
    </Stack>
  );
}
