import { Box, Progress, Stack, Text } from "@chakra-ui/react";
import { DropdownButton } from "@dhis2/ui";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import React from "react";
import { storeApi, attributionApi } from "../../Events";
import { INamed, IVisualization, Period } from "../../interfaces";
import { useDHIS2CategoryCombo } from "../../Queries";
import { $store, $attribution } from "../../Store";
import OrgUnitPicker from "../filters/OrgUnitPicker";
import PeriodPicker from "../filters/PeriodPicker";
import PeriodSelector from "../filters/PeriodSelector";
import OrganisationUnitLevels from "../OrganisationUnitLevels";
import OUTree from "../OUTree";

const Categories = ({ id }: { id: string }) => {
    const attribution = useStore($attribution);
    const { isLoading, isSuccess, isError, error, data } =
        useDHIS2CategoryCombo(true, null, id);

    if (isError) return <pre>{JSON.stringify(error)}</pre>;
    if (isLoading) return <Progress />;

    if (isSuccess && data)
        return (
            <Stack direction="row" w="100%" spacing="20px">
                {data.categories.map(({ name, id, categoryOptions }) => {
                    return (
                        <Stack key={id} direction="row" alignItems="center">
                            <Text>{name}</Text>
                            <Box minW="400px">
                                <Select<INamed, true, GroupBase<INamed>>
                                    isMulti
                                    options={categoryOptions}
                                    getOptionLabel={(d) => d.name ?? ""}
                                    getOptionValue={(d) => d.id}
                                    value={categoryOptions.filter(
                                        (a) =>
                                            attribution[id] &&
                                            attribution[id]
                                                .split(",")
                                                .indexOf(a.id) !== -1
                                    )}
                                    onChange={(e) =>
                                        attributionApi.add({
                                            [id]: e.map((e) => e.id).join(","),
                                        })
                                    }
                                />
                            </Box>
                        </Stack>
                    );
                })}
            </Stack>
        );

    return null;
};

export default function Filters({
    visualization,
}: {
    visualization: IVisualization;
}) {
    const store = useStore($store);
    const onChangePeriods = (periods: Period[]) => {
        storeApi.changePeriods(periods);
    };
    const grouped = visualization.properties["grouped"];
    const items = visualization.properties["layout.items"];
    const alignment: "row" | "column" =
        visualization.properties["layout.alignment"] ?? "row";
    const cc: string = visualization.properties["cc"];
    if (grouped)
        return (
            <Stack justifyContent="center">
                <DropdownButton
                    component={
                        <Stack
                            p="10px"
                            bg="white"
                            boxShadow="2xl"
                            overflow="auto"
                        >
                            {items?.map((i: string) => {
                                if (i === "organisations") {
                                    return (
                                        <>
                                            <Text>Organisations</Text>
                                            <OUTree
                                                value={store.organisations}
                                                onChange={(value) =>
                                                    storeApi.setOrganisations(
                                                        value
                                                    )
                                                }
                                            />
                                        </>
                                    );
                                }
                                if (i === "periods") {
                                    return (
                                        <>
                                            <Text>Period</Text>
                                            <PeriodSelector
                                                selectedPeriods={store.periods}
                                                onChange={onChangePeriods}
                                            />
                                        </>
                                    );
                                }
                                if (i === "organisations-levels") {
                                    return (
                                        <>
                                            <Text>Level</Text>
                                            <OrganisationUnitLevels />
                                        </>
                                    );
                                }
                                return null;
                            })}
                        </Stack>
                    }
                    name="buttonName"
                    value="buttonValue"
                    className="nrm"
                    primary
                >
                    Filters
                </DropdownButton>
            </Stack>
        );

    return (
        <Stack direction={alignment} spacing="20px">
            {items?.flatMap((i: string) => {
                if (i === "organisations") {
                    return <OrgUnitPicker key={i} />;
                }
                if (i === "periods") {
                    return <PeriodPicker key={i} />;
                }
                if (i === "organisations-levels") {
                    return <OrganisationUnitLevels key={i} />;
                }

                if (i === "category-combo" && cc) {
                    return <Categories id={cc} key={i} />;
                }
                return null;
            })}
        </Stack>
    );
}
