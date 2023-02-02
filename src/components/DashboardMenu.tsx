import {
  Box,
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { DropdownButton } from "@dhis2/ui";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { ChangeEvent, useState } from "react";
import {
  assignDataSet,
  changeCategory,
  changeDashboardDescription,
  changeDashboardName,
  changePeriods,
  setCurrentDashboard,
  setCurrentSection,
  setDashboards,
  setDefaultDashboard,
  setOrganisations,
  setRefresh,
} from "../Events";
import { IDashboard, Item, LocationGenerics, Option } from "../interfaces";
import { saveDocument } from "../Queries";
import {
  $categoryOptions,
  $dashboard,
  $dashboards,
  $dataSets,
  $store,
  createSection,
} from "../Store";
import AutoRefreshPicker from "./AutoRefreshPicker";
import OUTreeSelect from "./OUTreeSelect";

const DashboardMenu = () => {
  const search = useSearch<LocationGenerics>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const dashboards = useStore($dashboards);
  const dataSets = useStore($dataSets);
  const store = useStore($store);
  const dashboard = useStore($dashboard);
  const categoryOptions = useStore($categoryOptions);
  const [loading, setLoading] = useState<boolean>(false);
  const [isNotDesktop] = useMediaQuery(["(max-width: 992px)"]);
  const updateDashboard = async (data: any) => {
    setLoading(true);
    await saveDocument("i-dashboards", store.systemId, data);
    const setting = {
      default: store.defaultDashboard,
      id: store.systemId,
    };
    await saveDocument("i-dashboard-settings", store.systemId, setting);
    setLoading(() => false);
    setRefresh(true);
    onClose();
  };

  const togglePublish = async (data: IDashboard, value: boolean) => {
    await saveDocument("i-dashboards", store.systemId, {
      ...data,
      published: true,
    });
    setDashboards(
      dashboards.map((d) => {
        if (data.id === d.id) {
          return { ...d, published: value };
        }
        return d;
      })
    );
    setCurrentDashboard({ ...data, published: value });
  };

  const onChangePeriods = (periods: Item[]) => {
    changePeriods(periods);
  };

  return (
    <Stack
      direction="row"
      alignContent="center"
      alignItems="center"
      justifyContent="right"
      justifyItems="center"
      flex={1}
      spacing="10px"
      p="5px"
    >
      <Text
        fontSize="2.1vh"
        fontWeight="700"
        color="yellow.500"
        noOfLines={1}
      >{`${dashboard.name} Dashboard`}</Text>
      <Spacer />
      {store.isAdmin && !isNotDesktop && (
        <Stack
          direction="row"
          alignContent="center"
          alignItems="center"
          w="250px"
        >
          <Text>Category</Text>
          <Box flex={1}>
            <Select<Option, false, GroupBase<Option>>
              options={dataSets}
              value={dataSets.find(
                (d: Option) => d.value === dashboard.dataSet
              )}
              onChange={(e) => assignDataSet(e?.value || "")}
              size="sm"
            />
          </Box>
        </Stack>
      )}
      {store.isAdmin && !isNotDesktop && (
        <>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              setCurrentSection(createSection());
              navigate({
                to: `/dashboards/${dashboard.id}/section`,
                search,
              });
            }}
          >
            Add section
          </Button>
          <Button type="button" size="sm" onClick={onOpen}>
            Save
          </Button>
          {dashboard.published && (
            <Button size="sm" onClick={() => togglePublish(dashboard, false)}>
              Unpublish
            </Button>
          )}
          {!dashboard.published && (
            <Button size="sm" onClick={() => togglePublish(dashboard, true)}>
              Publish
            </Button>
          )}
        </>
      )}
      {store.isAdmin && !isNotDesktop && <AutoRefreshPicker />}
      <DropdownButton
        // 
        
        component={
          <Stack
            w="600px"
            p="15px"
            mt="7px"
            bg="white"
            boxShadow="2xl"
            // borderTopRadius="lg"
            overflow="auto"
            h="calc(100vh - 170px)"
          >
            {/* <DashboardCategorization dataSet={dashboard.dataSet} /> */}
            <Text>Organisation</Text>
            <OUTreeSelect
              value={store.organisations}
              onChange={(value) => setOrganisations(value)}
            />

            {/* <PeriodPicker
              selectedPeriods={store.periods}
              onChange={onChangePeriods}
            /> */}
          </Stack>
        }
        style={{backgroundColor: "yellow"}}
        name="buttonName"
        value="buttonValue"
        className="nrm"
      >
        Filter
      </DropdownButton>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Dashboard Options</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="20px">
              <Stack>
                <Text>Category</Text>
                <Select<Option, false, GroupBase<Option>>
                  options={categoryOptions}
                  value={categoryOptions.find(
                    (d: Option) => d.value === dashboard.category
                  )}
                  onChange={(e) => changeCategory(e?.value || "")}
                />
              </Stack>
              <Stack>
                <Text>Name</Text>
                <Input
                  value={dashboard.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    changeDashboardName(e.target.value)
                  }
                />
              </Stack>
              <Stack>
                <Text>Description</Text>
                <Textarea
                  value={dashboard.description}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    changeDashboardDescription(e.target.value)
                  }
                />
              </Stack>
              <Stack>
                <Checkbox
                  isChecked={store.defaultDashboard === dashboard.id}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setDefaultDashboard(e.target.checked ? dashboard.id : "")
                  }
                >
                  Default Dashboard
                </Checkbox>
              </Stack>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={() => updateDashboard(dashboard)}
              isLoading={loading}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default DashboardMenu;
