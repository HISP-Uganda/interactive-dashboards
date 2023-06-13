import { Checkbox, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { datumAPi } from "../../Events";
import { $visualizationQuery } from "../../Store";

type GlobalAndFilterProps = {
    dimension: string;
    type: string;
    useGlobal: boolean;
    setType: Dispatch<SetStateAction<"filter" | "dimension">>;
    setUseGlobal: Dispatch<SetStateAction<boolean>>;
    resource: string;
    prefix?: string;
    suffix?: string;
    id: string;
};

const GlobalAndFilter = ({
    dimension,
    useGlobal,
    setType,
    setUseGlobal,
    resource,
    type,
    prefix,
    suffix,
    id,
}: GlobalAndFilterProps) => {
    const visualizationQuery = useStore($visualizationQuery);
    return (
        <Stack direction="row" flex={1}>
            <RadioGroup
                onChange={(type: "filter" | "dimension") => {
                    setType(type);
                    Object.entries(visualizationQuery.dataDimensions || {})
                        .filter(([k, { resource: r }]) => r === resource)
                        .forEach(([key, dim]) => {
                            datumAPi.changeDimension({
                                id: key,
                                dimension: dimension,
                                type: type,
                                resource: resource,
                                prefix: prefix,
                                suffix: suffix,
                                label: dim.label,
                            });
                        });
                }}
                value={type}
            >
                <Stack direction="row">
                    <Radio value="dimension">Dimension</Radio>
                    <Radio value="filter">Filter</Radio>
                </Stack>
            </RadioGroup>
            <Checkbox
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    e.persist();
                    setUseGlobal(() => e.target.checked);
                    Object.entries(visualizationQuery.dataDimensions || {})
                        .filter(([k, { resource: r }]) => r === resource)
                        .forEach(([key]) => {
                            datumAPi.changeDimension({
                                id: key,
                                dimension: dimension,
                                type: type,
                                resource: resource,
                                prefix: prefix,
                                suffix: suffix,
                                remove: true,
                            });
                        });
                    if (e.target?.checked) {
                        datumAPi.changeDimension({
                            id,
                            dimension: dimension,
                            type: type,
                            resource: resource,
                            prefix: prefix,
                            suffix: suffix,
                        });
                    } else {
                        datumAPi.changeDimension({
                            id,
                            dimension: dimension,
                            type: type,
                            resource: resource,
                            prefix: prefix,
                            suffix: suffix,
                            remove: true,
                        });
                    }
                }}
                isChecked={useGlobal}
            >
                Use Global Filter
            </Checkbox>
        </Stack>
    );
};

export default GlobalAndFilter;
