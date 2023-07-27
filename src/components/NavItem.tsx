import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { ICategory, IDashboard, LocationGenerics } from "../interfaces";

interface NavItemProps {
    option: ICategory & { dashboards: IDashboard[] };
}
const NavItem = ({ option: { name, id, dashboards } }: NavItemProps) => {
    const navigate = useNavigate();
    const search = useSearch<LocationGenerics>();
    return (
        <Box key={id}>
            <Text
                color="gray.600"
                m="1"
                mt="2"
                fontSize="lg"
                fontWeight="bold"
                textTransform="uppercase"
            >
                {name}
            </Text>

            {dashboards.map((d) => (
                <Flex
                    alignItems="center"
                    key={d.id}
                    gap="5"
                    pt="1"
                    pl="2"
                    borderRadius="lg"
                    fontSize="lg"
                    m="2"
                    cursor="pointer"
                    _hover={{
                        bgColor: "teal",
                        color: "white",
                        transform: "scale(1.1)",
                    }}
                    //bgColor={dashboard.id === d.id ? "gray.200" : "gray.200"}
                    //color={dashboard.id === d.id ? "black" : ""}
                    // _hover={{
                    //     color: "blue.600", fontWeight: "bold", transform: "scale(1.1)",
                    // }}
                    _active={{ bgColor: "teal", color: "white" }}
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate({
                            to: `/dashboards/${d.id}`,
                            search,
                        });
                    }}
                >
                    {d.name}
                </Flex>
            ))}
        </Box>
    );
};

export default NavItem;
