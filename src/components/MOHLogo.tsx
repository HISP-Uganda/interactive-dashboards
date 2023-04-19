import { Image } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { setCurrentPage } from "../Events";
import { $store } from "../Store";

const MOHLogo = ({ width, height }: { height: number; width: number }) => {
    const navigate = useNavigate();
    const { isAdmin } = useStore($store);
    return (
        <Image
            maxH={`${height * 1}px`}
            maxW={`${width * 1}px`}
            src="https://raw.githubusercontent.com/HISP-Uganda/covid-dashboard/master/src/images/Coat_of_arms_of_Uganda.svg"
            onClick={() => {
                if (isAdmin) {
                    setCurrentPage("dashboards");
                    navigate({ to: "/dashboards" });
                }
            }}
        />
    );
};

export default MOHLogo;
