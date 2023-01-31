import { Spinner, Stack, Text } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { groupBy } from "lodash";
import { useDashboards } from "../Queries";
import { $categoryOptions, $globalFilters, $store } from "../Store";
import NavItem from "./NavItem";
import ThemeTree from "./ThemeTree";

export default function DashboardList() {
  const store = useStore($store);
  const { isLoading, isSuccess, isError, error, data } = useDashboards(
    store.systemId
  );
  const categoryOptions = useStore($categoryOptions);
  return (
    <>
      {isLoading && <Spinner />}
      {isSuccess && (
        <Stack spacing="40px" p="5px">
          {categoryOptions
            .map((category) => {
              const groupedDashboards = groupBy(data, "category");
              return {
                ...category,
                dashboards: groupedDashboards[category.value] || [],
              };
            })
            .filter(({ dashboards }) => dashboards.length > 0)
            .map((value) => {
              return <NavItem option={value} key={value.value} />;
            })}
          <ThemeTree />
        </Stack>
      )}

      {isError && <Text>No data/Error occurred</Text>}
    </>
  );
}
