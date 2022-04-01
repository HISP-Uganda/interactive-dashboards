import React, { ChangeEvent } from "react";
import { Box, Select, Spinner } from "@chakra-ui/react";
import { useNamespace } from "../Queries";
import { IData, IDataSource, INamed } from "../interfaces";
import { $store } from "../Store";
import { useStore } from "effector-react";
import { Event } from "effector";
import { changeVisualizationDataSource } from "../Events";
type NamespaceSelectProps = {
  namespace: string;
  value: IData;
  changeDataSource:Event<IDataSource>;
};
const NamespaceSelect = ({
  namespace,
  value,
  changeDataSource,
}: NamespaceSelectProps) => {
  const { isLoading, isSuccess, data, isError, error } =
    useNamespace(namespace);
  return (
    <>
      {isLoading && <Spinner />}
      {isSuccess && (
        <Select
          value={value.dataSource?.id}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            changeDataSource(
              data?.find((d: IDataSource) => d.id === e.target.value)
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
