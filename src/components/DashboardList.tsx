import { Spinner } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { groupBy } from "lodash";
import { useDashboards } from "../Queries";
import { $categoryOptions, $globalFilters, $store } from "../Store";
import NavItem from "./NavItem";

export default function DashboardList() {
  const store = useStore($store);
  const { isLoading, isSuccess, isError, error, data } = useDashboards(
    store.systemId
  );
  const categoryOptions = useStore($categoryOptions);
  return (
    <>
      {isLoading && <Spinner />}
      {isSuccess &&
        categoryOptions
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

      {isError && <pre>{JSON.stringify(error)}</pre>}
    </>
  );
}
