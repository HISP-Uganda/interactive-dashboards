import React, { ChangeEvent } from "react";
import { Box, Select, Spinner } from "@chakra-ui/react";
import { useNamespace } from "../Queries";
import { IDataSource, INamed } from "../interfaces";
import { $store } from "../Store";
import { useStore } from "effector-react";
import { changeVisualizationDataSource } from "../Events";
type NamespaceSelectProps = {
  namespace: string;
};
const NamespaceSelect = ({ namespace }: NamespaceSelectProps) => {
  const { isLoading, isSuccess, data, isError, error } =
    useNamespace(namespace);
  const store = useStore($store);
  return (
    <>
      {isLoading && <Spinner />}
      {isSuccess && (
        <Select
          value={store.visualization?.dataSource?.id}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            changeVisualizationDataSource(
              data.find((d: IDataSource) => d.id === e.target.value)
            )
          }
        >
          <option>Select Data Source</option>
          {data.map((dataSource: INamed) => (
            <option value={dataSource.id} key={dataSource.id}>
              {dataSource.name}
            </option>
          ))}
        </Select>
      )}
      {isError && <Box>{error.message}</Box>}
    </>
  );
};

export default NamespaceSelect;
