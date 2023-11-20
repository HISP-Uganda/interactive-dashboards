import { Stack } from "@chakra-ui/react";
import { useState } from "react";
import { datumAPi } from "../../Events";
import { MetadataAPI } from "../../interfaces";
import { computeGlobalParams, globalIds } from "../../utils/utils";
import OUTree from "../OUTree";
import GlobalSearchFilter from "./GlobalSearchFilter";

const OrgUnitTree = ({ api }: MetadataAPI) => {
    const [q, setQ] = useState<string>("");
    const { previousType, isGlobal, selected } = computeGlobalParams(
        "ou",
        "mclvD0Z9mfT"
    );
    const [type, setType] = useState<"filter" | "dimension">(previousType);
    const [useGlobal, setUseGlobal] = useState<boolean>(isGlobal);
    return (
        <Stack spacing="20px">
            <GlobalSearchFilter
                dimension="ou"
                setType={setType}
                useGlobal={useGlobal}
                setUseGlobal={setUseGlobal}
                resource="ou"
                type={type}
                setQ={setQ}
                q={q}
                id={globalIds[5].value}
            />
            <OUTree
                value={selected.map((s) => s.value)}
                onChange={(items) =>
                    items.forEach((id) => {
                        datumAPi.changeDimension({
                            id,
                            type,
                            dimension: "ou",
                            resource: "ou",
                        });
                    })
                }
            />
        </Stack>
    );
};

export default OrgUnitTree;
