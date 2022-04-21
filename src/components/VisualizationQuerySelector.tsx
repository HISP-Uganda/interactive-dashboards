import { Box, Spinner } from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { Event } from "effector";
import { useStore } from "effector-react";
import { IIndicator, IVisualization, Option } from "../interfaces";
import { useNamespace } from "../Queries";
import { $indicators } from "../Store";

type VisualizationQuerySelectorProps = {
  namespace: string;
  value?: IVisualization;
  changeDataSources: Event<IIndicator[]>;
};
const VisualizationQuerySelector = ({
  namespace,
  value,
  changeDataSources,
}: VisualizationQuerySelectorProps) => {
  const { isLoading, isSuccess, data, isError, error } =
    useNamespace(namespace);
  const indicators = useStore($indicators);
  return (
    <>
      {isLoading && <Spinner />}
      {isSuccess && (
        <Select<Option, true, GroupBase<Option>>
          isMulti
          value={
            data.flatMap((d: IIndicator) => {
              if (value?.indicators.find((i) => i === d.id)) {
                return {
                  value: d.id,
                  label: d.name,
                };
              }
            }) as any[]
          }
          onChange={(e) =>
            changeDataSources(
              data.filter(
                (d: IIndicator) => e.map((x) => x.value).indexOf(d.id) !== -1
              )
            )
          }
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

export default VisualizationQuerySelector;
