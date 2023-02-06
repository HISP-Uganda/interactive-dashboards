import { Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import { PeriodDimension } from "@dhis2/analytics";
import GlobalAndFilter from "./GlobalAndFilter";
import { IndicatorProps } from "../../interfaces";
import { globalIds } from "../../utils/utils";
import GlobalSearchFilter from "./GlobalSearchFilter";

const Periods = ({ denNum, onChange }: IndicatorProps) => {
  const [type, setType] = useState<"filter" | "dimension">("dimension");

  const selected = Object.entries(denNum?.dataDimensions || {})
    .filter(([k, { resource }]) => resource === "pe")
    .map(([key]) => {
      return key;
    });
  const [useGlobal, setUseGlobal] = useState<boolean>(
    () => selected.indexOf("m5D13FqKZwN") !== -1
  );
  const [q, setQ] = useState<string>("");

  return (
    <Stack spacing="20px">
      <GlobalSearchFilter
        denNum={denNum}
        dimension="pe"
        setType={setType}
        useGlobal={useGlobal}
        setUseGlobal={setUseGlobal}
        resource="pe"
        type={type}
        onChange={onChange}
        setQ={setQ}
        q={q}
        id={globalIds[0].value}
      />
      {!useGlobal && (
        <PeriodDimension
          onSelect={({ items }: any) => {
            items.forEach(({ id, name, ...others }: any) => {
              onChange({
                id,
                type,
                dimension: "pe",
                resource: "pe",
                label: name,
              });
            });
          }}
          selectedPeriods={selected}
        />
      )}
    </Stack>
  );
};

export default Periods;
