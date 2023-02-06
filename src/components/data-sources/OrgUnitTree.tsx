import { Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useStore } from "effector-react";
import { IndicatorProps } from "../../interfaces";
import { OrganizatioUnitTree } from "@dhis2/analytics";
import { $store } from "../../Store";
import OUTree from "../OUTree";
import { globalIds } from "../../utils/utils";
import GlobalAndFilter from "./GlobalAndFilter";
import GlobalSearchFilter from "./GlobalSearchFilter";

const OrgUnitTree = ({ denNum, onChange }: IndicatorProps) => {
  const store = useStore($store);
  const [type, setType] = useState<"filter" | "dimension">("dimension");
  const [q, setQ] = useState<string>("");
  const selected = Object.entries(denNum?.dataDimensions || {})
    .filter(([k, { resource }]) => resource === "ou")
    .map(([key, { label }]) => {
      return key;
    });
  const [useGlobal, setUseGlobal] = useState<boolean>(
    () => selected.indexOf("mclvD0Z9mfT") !== -1
  );
  return (
    <Stack spacing="20px">
      <GlobalSearchFilter
        dimension="ou"
        setType={setType}
        useGlobal={useGlobal}
        setUseGlobal={setUseGlobal}
        resource="ou"
        type={type}
        onChange={onChange}
        setQ={setQ}
        q={q}
        id={globalIds[5].value}
      />
    </Stack>
  );
};

export default OrgUnitTree;
