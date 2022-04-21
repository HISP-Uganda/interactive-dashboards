import { Spinner, Box } from "@chakra-ui/react";
import { Select, GroupBase } from "chakra-react-select";
import React from "react";
import { useNamespace } from "../Queries";
import { Option } from "../interfaces";
import { useStore } from "effector-react";
import { $store } from "../Store";
import { changeCategory } from "../Events";

const CategorySelect = () => {
  const { isLoading, isSuccess, data, isError, error } =
    useNamespace("i-categories");
  const store = useStore($store);
  return (
    <>
      {isLoading && <Spinner />}
      {isSuccess && (
        <Select<Option, false, GroupBase<Option>>
          value={store.category}
          onChange={(e) => changeCategory(e)}
          options={data.map((o) => {
            return {
              value: o.id,
              label: o.name,
            };
          })}
        />
      )}
      {isError && <Box>{error.message}</Box>}
    </>
  );
};

export default CategorySelect;
