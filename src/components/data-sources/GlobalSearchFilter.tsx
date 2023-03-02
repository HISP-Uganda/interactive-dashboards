import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Stack, Input } from "@chakra-ui/react";
import GlobalAndFilter from "./GlobalAndFilter";
import { IData, Dimension } from "../../interfaces";
import { globalIds } from "../../utils/utils";
import { Event } from "effector";

type GlobalSearchFilterProps = {
  denNum?: IData;
  useGlobal: boolean;
  setQ: (value: string) => void;
  setType: Dispatch<SetStateAction<"filter" | "dimension">>;
  setUseGlobal: Dispatch<SetStateAction<boolean>>;
  q: string;
  onChange: Event<Dimension>;
  type: "filter" | "dimension";
  dimension: string;
  id: string;
  resource: string;
  prefix?: string;
  suffix?: string;
};

export default function GlobalSearchFilter({
  denNum,
  useGlobal,
  q,
  setQ,
  setUseGlobal,
  setType,
  onChange,
  dimension,
  resource,
  type,
  id,
  prefix,
  suffix,
}: GlobalSearchFilterProps) {
  return (
    <Stack direction="row" w="100%" flex={1} alignItems="center">
      <GlobalAndFilter
        denNum={denNum}
        dimension={dimension}
        setType={setType}
        useGlobal={useGlobal}
        setUseGlobal={setUseGlobal}
        type={type}
        onChange={onChange}
        resource={resource}
        id={id}
        prefix={prefix}
        suffix={suffix}
      />
      {!useGlobal && (
        <Input
          w="500px"
          value={q}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
        />
      )}
    </Stack>
  );
}
