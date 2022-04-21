import { Box, Spinner } from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { changeDataSource } from "../Events";
import { Option } from "../interfaces";
import { useDataSources } from "../Queries";
import { $dataSourceOptions, $indicator } from "../Store";
const NamespaceSelect = () => {
  const { isLoading, isSuccess, isError, error } = useDataSources();
  const indicator = useStore($indicator);
  const dataSourceOptions = useStore($dataSourceOptions);
  return (
    <>
      {isLoading && <Spinner />}
      {isSuccess && (
        <Select<Option, false, GroupBase<Option>>
          value={dataSourceOptions.find(
            (d: Option) => d.value === indicator.dataSource
          )}
          onChange={(e) => changeDataSource(e?.value)}
          options={dataSourceOptions}
        />
      )}
      {isError && <Box>{error.message}</Box>}
    </>
  );
};

export default NamespaceSelect;
