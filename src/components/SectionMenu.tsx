import { Button, IconButton, Spacer, Stack, Text } from "@chakra-ui/react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { MdKeyboardBackspace } from "react-icons/md";
import { addSection, setDashboards } from "../Events";
import { FormGenerics } from "../interfaces";
import { $dashboard, $dashboards, $section } from "../Store";

const SectionMenu = () => {
  const navigate = useNavigate();
  const search = useSearch<FormGenerics>();
  const dashboard = useStore($dashboard);
  const section = useStore($section);
  const dashboards = useStore($dashboards);

  const onApply = () => {
    addSection(section);
    setDashboards(
      dashboards.map((dash) => {
        if (dash.id === dashboard.id) {
          if (section.isBottomSection) {
            return { ...dashboard, bottomSection: section };
          } else {
            const isOld = dashboard.sections.find((s) => s.id === section.id);
            let sections = dashboard.sections.map((s) => {
              if (section.id === s.id) {
                return section;
              }
              return s;
            });
            if (!isOld) {
              sections = [...sections, section];
            }
            return { ...dashboard, sections };
          }
        }
        return dash;
      })
    );
    navigate({
      to: `/dashboards/${dashboard.id}`,
      search,
    });
  };

  return (
    <Stack direction="row" h="48px">
      <Stack direction="row" alignItems="center" justifyItems="center">
        <IconButton
          bg="none"
          _hover={{ bg: "none" }}
          aria-label="Search database"
          icon={<MdKeyboardBackspace />}
          onClick={() => {
            navigate({
              to: `/dashboards/${dashboard.id}`,
              search,
            });
          }}
        />
        <Stack direction="row" spacing="2px" fontSize="16px">
          <Text>{dashboard.name}</Text>
          <Text>/</Text>
          <Text>{section.id}</Text>
          <Text>/</Text>
          <Text>Edit Section</Text>
        </Stack>
      </Stack>
      <Spacer />
      <Button
        size="sm"
        onClick={() => {
          navigate({
            to: `/dashboards/${dashboard.id}`,
            search,
          });
        }}
      >
        Discard
      </Button>
      <Button size="sm" onClick={() => onApply()}>
        Apply
      </Button>
    </Stack>
  );
};

export default SectionMenu;
