import { Stack, StackProps } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-location";
import { setCurrentPage } from "../Events";

interface Props extends StackProps {
    children: JSX.Element;
}

const MOHLogo2 = ({ children, ...rest }: Props) => {
    const navigate = useNavigate();
    return (
        <Stack
            {...rest}
            alignContent="center"
            alignItems="center"
            justifyContent="center"
            justifyItems="center"
            onClick={() => {
                setCurrentPage("dashboards");
                navigate({ to: "/dashboards" });
            }}
        >
            {children}
        </Stack>
    );
};

export default MOHLogo2;
