import { Button, Divider, Stack, Text } from "@chakra-ui/react";
import { groupBy } from "lodash";
import { useState } from "react";

import { useNavigate } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { $categoryOptions, $dashboards, $store } from "../Store";
import SidebarContent from "./SidebarContent";
const DashboardMenu = () => {
  const navigate = useNavigate();
  const categoryOptions = useStore($categoryOptions);
  const store = useStore($store);
  const dashboards = groupBy(useStore($dashboards), "category");
  const [active, setActive] = useState<string>("title");
  const toggle = (id: string) => {
    if (active === id) {
      setActive("");
    } else {
      setActive(id);
    }
  };

  const getDashboards = (category: string) => {
    return dashboards[category] || [];
  };

  return (
    // <SidebarContent />
    <Stack flex={1}>
      <Stack spacing="10px" h="100%" p="10px" >
        <Text fontSize="xl" fontWeight="bold" textTransform="uppercase" color="red.500">
          Thematic Areas
        </Text>
        <Divider />
        {categoryOptions.map(({ label, value }) => {
          const categoryDashboards = getDashboards(value);
          return (
            <Stack
              cursor="pointer"
              key={value}
              onClick={() => {
                toggle(value);

                if (categoryDashboards.length > 0) {
                  navigate({
                    to: `/dashboards/${categoryDashboards[0].id}`,
                    search: {
                      category: value,
                      periods: store.periods.map((i) => i.id),
                      organisations: store.organisations,
                      groups: store.groups,
                      levels: store.levels,
                    },
                  });
                }
              }}
            >
              <Text fontSize="lg" color="red.900" fontWeight="bold">
                {label}
              </Text>
              {active === value && (
                <Stack pl="20px" w="100%">
                  {categoryDashboards.map((dashboard) => (
                    <Text
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate({
                          to: `/dashboards/${dashboard.id}`,
                          search: {
                            category: value,
                            periods: store.periods.map((i) => i.id),
                            organisations: store.organisations,
                            groups: store.groups,
                            levels: store.levels,
                          },
                        });
                      }}
                    >
                      {dashboard.name}
                    </Text>
                  ))}
                </Stack>
              )}
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default DashboardMenu;
