import { Image } from "@chakra-ui/react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { setCurrentPage } from "../Events";
import moh from "../images/moh.json";
import { FormGenerics } from "../interfaces";
import { $store } from "../Store";

const MOHLogo = () => {
  const navigate = useNavigate();
  // const search = useSearch<FormGenerics>();
  // const store = useStore($store);
  return (
    <Image
      src={moh}
      alt="Ministry of Health"
      maxWidth="80px"
      h="auto"
      cursor="pointer"
      onClick={() => {
        setCurrentPage("");
        navigate({ to: "/dashboards" });
      }}
    />
  );
};

export default MOHLogo;
