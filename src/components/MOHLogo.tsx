import { Image } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-location";
import { setCurrentPage } from "../Events";

const MOHLogo = ({ width, height }: { height: number; width: number }) => {
  const navigate = useNavigate();
  return (
    <Image
      maxH={`${height * 1}px`}
      maxW={`${width * 1}px`}
      src="https://raw.githubusercontent.com/HISP-Uganda/covid-dashboard/master/src/images/Coat_of_arms_of_Uganda.svg"
      onClick={() => {
        setCurrentPage("dashboards");
        navigate({ to: "/dashboards" });
      }}
    />
  );
};

export default MOHLogo;
