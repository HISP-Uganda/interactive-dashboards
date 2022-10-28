import { Image, Stack } from "@chakra-ui/react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { MouseEvent } from "react";
import { FullScreenHandle } from "react-full-screen";
import { setCurrentSection } from "../Events";
import { FormGenerics } from "../interfaces";
import { $dashboard, $store } from "../Store";
import SectionVisualization from "./SectionVisualization";

interface Props {
  handle: FullScreenHandle;
}

export default function ({ handle }: Props) {
  const dashboard = useStore($dashboard);
  const store = useStore($store);
  const navigate = useNavigate();
  const search = useSearch<FormGenerics>();

  return (
    <Stack
      direction="row"
      backgroundColor="white"
      onClick={(e: MouseEvent<HTMLElement>) => {
        if (e.detail === 2 && store.isAdmin) {
          setCurrentSection(dashboard.bottomSection);
          navigate({
            to: `/dashboards/${dashboard.id}/section`,
            search,
          });
        }
      }}
    >
      {(handle.active || !store.showSider) && (
        <Image
          src="https://raw.githubusercontent.com/HISP-Uganda/covid-dashboard/master/src/images/logo.png"
          maxH="48px"
          maxW="250px"
        />
      )}

      <Stack
        flex={1}
        maxH="48px"
        alignItems="center"
        alignContent="center"
        justifyItems="center"
        justifyContent="center"
      >
        {store.showFooter && (
          <SectionVisualization {...dashboard.bottomSection} />
        )}
      </Stack>

      <Image
        src="https://tukuz.com/wp-content/uploads/2020/10/gavi-the-vaccine-alliance-logo-vector.png"
        maxH={"48px"}
        maxW={"250px"}
      />
    </Stack>
  );
}
