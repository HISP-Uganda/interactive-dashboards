import { Box, Stack } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-location";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { changeSelectedCategory, changeSelectedDashboard } from "../../Events";
import { Option } from "../../interfaces";
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
      <Box width="300px">
        <Select<Option, false, GroupBase<Option>>
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
              }
            }
          }}
          options={categoryOptions}
        />
      </Box>
      <Box width="300px">
        <Select<Option, false, GroupBase<Option>>
          size="sm"
          value={categoryDashboards.filter(
            (d: Option) => d.value === store.selectedDashboard
          )}
          onChange={(e) => {
            if (e && e.value) {
              changeSelectedDashboard(e.value);
              navigate({
                to: `/dashboards/${e.value}`,
                search: {
                  edit: true,
                  category: store.selectedCategory,
                  periods: store.periods.map((i) => i.id),
                  organisations: store.organisations,
                  groups: store.groups,
                  levels: store.levels,
                },
              });
            }
          }}
          options={categoryDashboards}
        />
      </Box>
    </Stack>
  );
};

export default DashboardFilter;
