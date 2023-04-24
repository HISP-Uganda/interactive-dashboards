import { Stack } from "@chakra-ui/react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { MouseEvent } from "react";
import { FullScreenHandle } from "react-full-screen";
import { setCurrentSection } from "../Events";
import { LocationGenerics } from "../interfaces";
import { $dashboard, $store } from "../Store";
import { otherHeaders } from "./constants";
import SectionVisualization from "./SectionVisualization";
import ImageUpload from "./ImageUpload";

interface Props {
  handle: FullScreenHandle;
}

export default function ({ handle }: Props) {
  const dashboard = useStore($dashboard);
  const store = useStore($store);
  const navigate = useNavigate();
  const search = useSearch<LocationGenerics>();

  return (
    <Stack
      direction="row"
      w="100%"
      h="100%"
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
      <Stack
        flex={1}
        maxH={`${otherHeaders}px`}
        alignItems="center"
        alignContent="center"
        justifyItems="center"
        justifyContent="center"
      >
        {store.showFooter && (
          <SectionVisualization {...dashboard.bottomSection} />
        )}
      </Stack>
      <ImageUpload alignment="bottom-right" />
    </Stack>
  );
}
