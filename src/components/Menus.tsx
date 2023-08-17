import { Icon, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-location";
import { BsFolderPlus } from "react-icons/bs";
import { MdAddchart, MdInput, MdOutlineDashboard } from "react-icons/md";
import { boolean } from "mathjs";

const Menus = () => {
    const navigate = useNavigate();
    return (
        <Stack
            spacing="25px"
            boxShadow="2xl"
            h="calc(100vh - 96px - 72px)"
            p="20px"
        >
            <Stack
                alignItems="center"
                alignContent="center"
                cursor="pointer"
                direction="row"
                onClick={() => navigate({ to: "/settings/data-sources" })}
                _hover={{
                    color: "blue.600",
                    fontWeight: "bold",
                    transform: "scale(1.1)",
                }}
                transition="ease-in-out 0.3s"
            >
                <Icon as={MdInput} w={8} h={8} color="blue.600" />
                <Text>Data Sources</Text>
            </Stack>
            <Stack
                alignItems="center"
                alignContent="center"
                direction="row"
                cursor="pointer"
                onClick={() => navigate({ to: "/settings/categories" })}
                _hover={{
                    color: "blue.600",
                    fontWeight: "bold",
                    transform: "scale(1.1)",
                }}
                transition="ease-in-out 0.3s"
            >
                <Icon as={BsFolderPlus} w={8} h={8} color="blue.600" />
                <Text>Categories</Text>
            </Stack>
            <Stack
                alignItems="center"
                alignContent="center"
                direction="row"
                cursor="pointer"
                onClick={() =>
                    navigate({ to: "/settings/visualization-queries" })
                }
                _hover={{
                    color: "blue.600",
                    fontWeight: "bold",
                    transform: "scale(1.1)",
                }}
                transition="ease-in-out 0.3s"
            >
                <Icon as={MdAddchart} w={8} h={8} color="blue.600" />
                <Text>Visualization Queries</Text>
            </Stack>
            <Stack
                alignItems="center"
                alignContent="center"
                direction="row"
                cursor="pointer"
                onClick={() => navigate({ to: "/settings/indicators" })}
                _hover={{
                    color: "blue.600",
                    fontWeight: "bold",
                    transform: "scale(1.1)",
                }}
                transition="ease-in-out 0.3s"
            >
                <Icon as={MdAddchart} w={8} h={8} color="blue.600" />
                <Text>Indicators</Text>
            </Stack>
            <Stack
                alignItems="center"
                alignContent="center"
                direction="row"
                cursor="pointer"
                onClick={() => navigate({ to: "/settings/dashboards" })}
                _hover={{
                    color: "blue.600",
                    fontWeight: "bold",
                    transform: "scale(1.1)",
                }}
                transition="ease-in-out 0.3s"
            >
                <Icon as={MdOutlineDashboard} w={8} h={8} color="blue.600" />
                <Text>Dashboards</Text>
            </Stack>
            <Stack
                alignItems="center"
                alignContent="center"
                direction="row"
                cursor="pointer"
                onClick={() => navigate({ to: "/settings/presentations" })}
                _hover={{
                    color: "blue.600",
                    fontWeight: "bold",
                    transform: "scale(1.1)",
                }}
                transition="ease-in-out 0.3s"
            >
                <Icon as={MdOutlineDashboard} w={8} h={8} color="blue.600" />
                <Text>Presentations</Text>
            </Stack>
        </Stack>
    );
};

export default Menus;
