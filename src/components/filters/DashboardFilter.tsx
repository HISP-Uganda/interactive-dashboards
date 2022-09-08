import { Key } from "react";
import { Box, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-location";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { changeSelectedCategory, changeSelectedDashboard } from "../../Events";
import { FormGenerics, Option } from "../../interfaces";
import {
  $categoryOptions,
  $store,
  $categoryDashboards,
  $dashboards,
} from "../../Store";

const DashboardFilter = () => {
  const categoryOptions = useStore($categoryOptions);
  const categoryDashboards = useStore($categoryDashboards);
  const store = useStore($store);
  const dashboards = useStore($dashboards);
  const navigate = useNavigate();
  return (
    <Stack spacing="10px" direction="row" fontSize="16px" alignItems="center">
      {/* <Text fontSize="lg">Thematic Area</Text>
      <Box width="250px" bg="white">
        <Select<Option, false, GroupBase<Option>>
          placeholder="Select Thematic Area"
          size="sm"
          value={categoryOptions.filter(
            (d: Option) => d.value === store.selectedCategory
          )}
          onChange={(e) => {
            if (e && e.value) {
              changeSelectedCategory(e.value);
              const allCategoryDashboards = dashboards.filter(
                (d) => d.category === e.value
              );
              if (allCategoryDashboards.length > 0) {
                changeSelectedDashboard(allCategoryDashboards[0].id);

                let search: any = {
                  category: e.value,
                  periods: store.periods.map((i) => i.id),
                  organisations: store.organisations.map((k: Key) => String(k)),
                  groups: store.groups,
                  levels: store.levels,
                };

                if (store.isAdmin) {
                  search = { ...search, edit: true };
                }
                navigate({
                  to: `/dashboards/${allCategoryDashboards[0].id}`,
                  search,
                });
              }
            }
          }}
          options={categoryOptions}
        />
      </Box> */}
      {/* <Text fontSize="lg">Dashboards</Text>
      <Box width="250px" bg="white">
        <Select<Option, false, GroupBase<Option>>
          size="sm"
          value={categoryDashboards.filter(
            (d: Option) => d.value === store.selectedDashboard
          )}
          onChange={(e) => {
            if (e && e.value) {
              changeSelectedDashboard(e.value);

              let search: any = {
                category: store.selectedCategory,
                periods: store.periods.map((i) => i.id),
                organisations: store.organisations.map((k: Key) => String(k)),
                groups: store.groups,
                levels: store.levels,
              };

              if (store.isAdmin) {
                search = { ...search, edit: true };
              }
              navigate({
                to: `/dashboards/${e.value}`,
                search,
              });
            }
          }}
          options={categoryDashboards}
        />
      </Box> */}
    </Stack>
  );
};

export default DashboardFilter;
