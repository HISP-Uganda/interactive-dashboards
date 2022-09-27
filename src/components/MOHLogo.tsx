import { useNavigate } from "@tanstack/react-location";
import { setCurrentPage } from "../Events";
import moh from "../images/moh.json";
import HAndWAware from "./HAndWAware";

const MOHLogo = () => {
  const navigate = useNavigate();
  return (
    <HAndWAware
      src={moh}
      minusH={10}
      minusW={0}
      onClick={() => {
        setCurrentPage("");
        navigate({ to: "/dashboards" });
      }}
    />
  );
};

export default MOHLogo;
