import { Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useStore } from "effector-react";
import { IndicatorProps } from "../../interfaces";
import { OrganizatioUnitTree } from "@dhis2/analytics";
import { $store } from "../../Store";
import OUTree from "../OUTree";
import { globalIds } from "../../utils/utils";
import GlobalAndFilter from "./GlobalAndFilter";

const OrgUnitTree = ({ denNum, onChange }: IndicatorProps) => {
  const store = useStore($store);
  const [dimension, setDimension] = useState<"filter" | "dimension">("filter");
  const selected = Object.entries(denNum?.dataDimensions || {})
    .filter(([k, { what }]) => what === "ou")
    .map(([key, { label }]) => {
      return key;
    });
  const [useGlobal, setUseGlobal] = useState<boolean>(
    () => selected.indexOf("GQhi6pRnTKF") !== -1
  );
  return (
    <Stack spacing="20px">
      <GlobalAndFilter
        denNum={denNum}
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
