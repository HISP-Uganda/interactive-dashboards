import { Dispatch, SetStateAction } from "react";
import { Event } from "effector";
import { Checkbox, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { ChangeEvent } from "react";

type GlobalAndFilterProps = {
  dimension: string;
  useGlobal: boolean;
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
}: GlobalAndFilterProps) => {
  return (
    <Stack spacing="20px">
      <RadioGroup
        onChange={(type: "filter" | "dimension") => setDimension(type)}
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
          checked={useGlobal}
        >
          Use Global Filter
        </Checkbox>
      )}
    </Stack>
  );
};

export default GlobalAndFilter;
