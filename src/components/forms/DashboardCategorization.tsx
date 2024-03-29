import { Stack, Text } from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { dashboardApi } from "../../Events";
import { Option } from "../../interfaces";
import { useDataSet } from "../../Queries";
import { $dashboard } from "../../Store";
import LoadingIndicator from "../LoadingIndicator";

type DashboardCategorizationProps = {
    dataSet: string;
};
const DashboardCategorization = ({ dataSet }: DashboardCategorizationProps) => {
    const { isLoading, isSuccess, isError, error } = useDataSet(dataSet);
    const dashboard = useStore($dashboard);
    return (
        <>
            {isLoading && <LoadingIndicator />}
            {isSuccess && (
                <Stack spacing="30px">
                    {dashboard.availableCategories.map(
                        ({ id, name, categoryOptions }) => {
                            return (
                                <Stack key={id}>
                                    <Text fontWeight="bold" fontSize="16px">
                                        {name}
                                    </Text>
                                    <Select<Option, true, GroupBase<Option>>
                                        value={dashboard.categorization[id]}
                                        hideSelectedOptions={false}
                                        selectedOptionStyle="check"
                                        isMulti
                                        onChange={(
                                            value: any,
                                            actions: any
                                        ) => {
                                            dashboardApi.setCategorization({
                                                ...dashboard.categorization,
                                                [id]: value,
                                            });
                                        }}
                                        options={categoryOptions}
                                    />
                                </Stack>
                            );
                        }
                    )}
                </Stack>
            )}
        </>
    );
};

export default DashboardCategorization;
