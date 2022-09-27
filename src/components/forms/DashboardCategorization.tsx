import { Box, Spinner, Stack, Text } from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { setCategorization } from "../../Events";
import { Option } from "../../interfaces";
import { useDataSet } from "../../Queries";
import { $dashboard, $store } from "../../Store";

type DashboardCategorizationProps = {
  dataSet: string;
};
const DashboardCategorization = ({ dataSet }: DashboardCategorizationProps) => {
  const { isLoading, isSuccess, isError, error } = useDataSet(dataSet);
  const dashboard = useStore($dashboard);
  const store = useStore($store);
  return (
    <>
      {isLoading && <Spinner />}
      {isSuccess && (
        <Stack flex={1} direction="row" spacing="20px">
          {dashboard.availableCategories.map(
            ({ id, name, categoryOptions }) => {
              return (
                <Stack
                  key={id}
                  direction="row"
                  alignItems="center"
                  alignContent="center"
                >
                  <Text fontWeight="bold" fontSize="16px">
                    {name}
                  </Text>
                  <Box w={store.isAdmin ? "150px" : "100%"} bg="white" flex={1}>
                    <Select<Option, true, GroupBase<Option>>
                      value={dashboard.categorization[id]}
                      hideSelectedOptions={false}
                      selectedOptionStyle="check"
                      isMulti
                      onChange={(value: any, actions: any) => {
                        setCategorization({
                          ...dashboard.categorization,
                          [id]: value,
                        });
                      }}
                      options={categoryOptions}
                    />
                  </Box>
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
