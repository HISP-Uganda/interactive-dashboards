import { Stack, Text } from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { useLiveQuery } from "dexie-react-hooks";
import { useStore } from "effector-react";
import React from "react";
import { db } from "../db";
import { storeApi } from "../Events";
import { Option } from "../interfaces";
import { $store } from "../Store";
export default function OrganisationUnitLevels() {
    const organisations = useLiveQuery(() => db.levels.toArray());
    const store = useStore($store);
    return (
        <Stack>
            <Text>OrganisationUnit Level</Text>
            <Select<Option, true, GroupBase<Option>>
                value={organisations?.filter(
                    (pt) => store.levels.indexOf(String(pt.value)) !== -1
                )}
                onChange={(e) => {
                    storeApi.changeLevels(e?.map((ex) => String(ex.value)));
                }}
                options={organisations}
                isClearable
                isMulti
                // menuPlacement="top"
            />
        </Stack>
    );
}
