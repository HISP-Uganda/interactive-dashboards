import { MouseEvent } from "react";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  Spacer,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { setCurrentSection } from "../Events";
import { useStore } from "effector-react";
import { $dashboard, $store } from "../Store";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { FormGenerics } from "../interfaces";
import { FullScreenHandle } from "react-full-screen";
import SectionVisualization from "./SectionVisualization";

interface Props {
  handle: FullScreenHandle;
  funderLogoRef?: React.LegacyRef<HTMLDivElement> | undefined;
  funderLogo1Ref?: React.LegacyRef<HTMLDivElement> | undefined;
  fh: number;
  fw: number;
  f1h: number;
  f1w: number;
}

export default function ({
  handle,
  funderLogoRef,
  funderLogo1Ref,
  fh,
  fw,
  f1h,
  f1w,
}: Props) {
  const dashboard = useStore($dashboard);
  const store = useStore($store);
  const navigate = useNavigate();
  const search = useSearch<FormGenerics>();

  return (
    <GridItem
      rowSpan={1}
      h="100%"
      w="100%"
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
      <Grid templateColumns="repeat(24, 1fr)" h="100%" w="100%" >
        {handle.active && (
          <GridItem h="100%" w="100%" colSpan={3}>
            <Stack
              h="100%"
              w="100%"
              // alignItems="center"
              alignContent="center"
              justifyContent="center"
              justifyItems="center"
              ref={funderLogoRef}
            >
              <Image
                src="https://raw.githubusercontent.com/HISP-Uganda/covid-dashboard/master/src/images/logo.png"
                maxH={`${fh * 0.7}px`}
                maxW={`${fw * 0.7}px`}
              />
            </Stack>
          </GridItem>
        )}
        <GridItem colSpan={handle.active ? 18 : 21} h="100%" w="100%">
          <Stack
            h="100%"
            w="100%"
            // alignItems="center"
            justifyItems="center"
            justifyContent="center"
            alignContent="center"
          >
            <SectionVisualization {...dashboard.bottomSection} />
          </Stack>
        </GridItem>
        <GridItem h="100%" w="100%" colSpan={3}>
          <Stack
            h="100%"
            w="100%"
            alignItems="flex-end"
            alignContent="center"
            justifyContent="center"
            justifyItems="center"
            ref={funderLogo1Ref}
          >
            <Image
              src="https://raw.githubusercontent.com/HISP-Uganda/covid-dashboard/master/src/images/h-logo-blue.svg"
              maxH={`${f1h * 0.7}px`}
              maxW={`${f1w * 0.7}px`}
            />
          </Stack>
        </GridItem>
      </Grid>
    </GridItem>
  );
}
