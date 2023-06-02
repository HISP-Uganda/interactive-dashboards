import { Button, Spacer, Stack, Text } from "@chakra-ui/react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { dashboardApi, storeApi } from "../Events";
import { LocationGenerics } from "../interfaces";
import { $dashboard, $section } from "../Store";

const SectionMenu = () => {
    const navigate = useNavigate();
    const search = useSearch<LocationGenerics>();
    const dashboard = useStore($dashboard);
    const section = useStore($section);

    const onApply = () => {
        dashboardApi.addSection(section);
        storeApi.setRefresh(false);
        navigate({
            to: `/dashboards/${dashboard.id}`,
            search,
        });
    };

    return (
        <Stack direction="row" alignItems="center" w="100%" p="5px">
            <Stack direction="row" spacing="2px" fontSize="16px">
                <Text>{dashboard.name}</Text>
                <Text>/</Text>
                <Text>{section.id}</Text>
                <Text>/</Text>
                <Text>Edit Section</Text>
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
