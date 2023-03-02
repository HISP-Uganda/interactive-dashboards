import { Checkbox, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { Event } from "effector";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Dimension, IData } from "../../interfaces";

type GlobalAndFilterProps = {
    dimension: string;
    type: string;
    useGlobal: boolean;
    denNum: IData | undefined;
    setType: Dispatch<SetStateAction<"filter" | "dimension">>;
    setUseGlobal: Dispatch<SetStateAction<boolean>>;
    resource: string;
    prefix?: string;
    suffix?: string;
    onChange: Event<Dimension>;
    id: string;
};

const GlobalAndFilter = ({
    dimension,
    useGlobal,
    setType,
    setUseGlobal,
    onChange,
    resource,
    type,
    prefix,
    suffix,
    id,
    denNum,
}: GlobalAndFilterProps) => {
    return (
        <Stack direction="row" flex={1}>
            <RadioGroup
                onChange={(type: "filter" | "dimension") => {
                    setType(type);
                    Object.entries(denNum?.dataDimensions || {})
                        .filter(([k, { resource: r }]) => r === resource)
                        .forEach(([key, dim]) => {
                            onChange({
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
                    Object.entries(denNum?.dataDimensions || {})
                        .filter(([k, { resource: r }]) => r === resource)
                        .forEach(([key]) => {
                            onChange({
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
                        onChange({
                            id,
                            dimension: dimension,
                            type: type,
                            resource: resource,
                            prefix: prefix,
                            suffix: suffix,
                        });
                    } else {
                        onChange({
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
