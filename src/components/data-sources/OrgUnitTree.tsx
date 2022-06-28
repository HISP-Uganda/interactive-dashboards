import { Stack } from "@chakra-ui/react";
import { useState } from "react";
import { IndicatorProps } from "../../interfaces";
import { globalIds } from "../../utils/utils";
import GlobalAndFilter from "./GlobalAndFilter";

const OrgUnitTree = ({ denNum, onChange }: IndicatorProps) => {
  const [dimension, setDimension] = useState<"filter" | "dimension">("filter");
  const [useGlobal, setUseGlobal] = useState<boolean>(false);
  return (
    <Stack spacing="20px">
      <GlobalAndFilter
        dimension={dimension}
        setDimension={setDimension}
        useGlobal={useGlobal}
        setUseGlobal={setUseGlobal}
        type="ou"
        onChange={onChange}
        id={globalIds[5].value}
      />
    </Stack>
  );
};

export default OrgUnitTree;
