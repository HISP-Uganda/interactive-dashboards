import { Dispatch, SetStateAction } from "react";
import { Event } from "effector";
import { Checkbox, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { ChangeEvent } from "react";
import { IData } from "../../interfaces";

type GlobalAndFilterProps = {
  dimension: string;
  useGlobal: boolean;
  denNum: IData | undefined;
  setDimension: Dispatch<SetStateAction<"filter" | "dimension">>;
  setUseGlobal: Dispatch<SetStateAction<boolean>>;
  hasGlobalFilter?: boolean;
  type: string;
  onChange: Event<{
    id: string;
    what: string;
    type: string;
    remove?: boolean | undefined;
    label?: string | undefined;
  }>;
  id: string;
};

const GlobalAndFilter = ({
  dimension,
  useGlobal,
  setDimension,
  setUseGlobal,
  onChange,
  type,
  id,
  hasGlobalFilter = true,
  denNum,
}: GlobalAndFilterProps) => {
  return (
    <Stack spacing="20px">
      <RadioGroup
        onChange={(dimension: "filter" | "dimension") => {
          setDimension(dimension);
          Object.entries(denNum?.dataDimensions || {})
            .filter(([k, { what }]) => what === type)
            .forEach(([key, dim]) => {
              onChange({
                id: key,
                type: dimension,
                what: type,
                label: dim.label,
              });
            });
        }}
        value={dimension}
      >
        <Stack direction="row">
          <Radio value="dimension">Dimension</Radio>
          <Radio value="filter">Filter</Radio>
        </Stack>
      </RadioGroup>
      {hasGlobalFilter && (
        <Checkbox
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setUseGlobal(e.target.checked);
            Object.entries(denNum?.dataDimensions || {})
              .filter(([k, { what }]) => what === type)
              .forEach(([key]) => {
                onChange({
                  id: key,
                  type: dimension,
                  what: type,
                  remove: true,
                });
              });
            if (e.target.checked) {
              onChange({
                id,
                type: dimension,
                what: type,
              });
            } else {
              onChange({
                id,
                type: dimension,
                what: type,
                remove: true,
              });
            }
          }}
          isChecked={useGlobal}
        >
          Use Global Filter
        </Checkbox>
      )}
    </Stack>
  );
};

export default GlobalAndFilter;
