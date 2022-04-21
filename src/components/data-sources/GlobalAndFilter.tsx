import { Dispatch, SetStateAction } from "react";
import { Checkbox, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { ChangeEvent } from "react";

type GlobalAndFilterProps = {
  dimension: string;
  useGlobal: boolean;
  setDimension: Dispatch<SetStateAction<"filter" | "dimension">>;
  setUseGlobal: Dispatch<SetStateAction<boolean>>;
  hasGlobalFilter?: boolean;
};

const GlobalAndFilter = ({
  dimension,
  useGlobal,
  setDimension,
  setUseGlobal,
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
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setUseGlobal(e.target.checked)
          }
          checked={useGlobal}
        >
          Use Global Filter
        </Checkbox>
      )}
    </Stack>
  );
};

export default GlobalAndFilter;
