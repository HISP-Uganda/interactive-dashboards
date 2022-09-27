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
  Stack,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { ChangeEvent } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
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
} from "../Events";
import { FormGenerics, IDashboard, Item, Option } from "../interfaces";
import {
  $categoryOptions,
  $dashboard,
  $dashboards,
  $dataSets,
  $store,
  createSection,
} from "../Store";
import AutoRefreshPicker from "./AutoRefreshPicker";
import DashboardCategorization from "./forms/DashboardCategorization";
import OUTreeSelect from "./OUTreeSelect";
import PeriodPicker from "./PeriodPicker";
const DashboardMenu = () => {
  const search = useSearch<FormGenerics>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const engine = useDataEngine();
  const dashboards = useStore($dashboards);
  const dataSets = useStore($dataSets);
  const updateDashboard = async (data: any) => {
    console.log(data);
    let mutation: any = {
      type: "create",
      resource: `dataStore/i-dashboards/${data.id}`,
      data,
    };
    if (search.edit) {
      mutation = {
        type: "update",
        resource: `dataStore/i-dashboards`,
        data: data,
        id: data.id,
      };
    }
    let mutations = [engine.mutate(mutation)];
    // const mutation2: any = {
    //   type: "update",
    //   resource: `dataStore/i-dashboard-settings`,
    //   data: { default: store.defaultDashboard },
    //   id: "settings",
    // };
    await Promise.all(mutations);
    onClose();
  };

  const togglePublish = async (data: IDashboard, value: boolean) => {
    let mutation: any = {
      type: "update",
      resource: `dataStore/i-dashboards`,
      data: { ...data, published: true },
      id: data.id,
    };
    await engine.mutate(mutation);
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
  const store = useStore($store);
  const dashboard = useStore($dashboard);
  const categoryOptions = useStore($categoryOptions);
  const onChangePeriods = (periods: Item[]) => {
    changePeriods(periods);
  };

  return (
    <Stack
      direction="row"
      alignContent="center"
      alignItems="center"
      justifyContent="center"
      justifyItems="center"
      flex={1}
      h="50px"
    >
      {store.isAdmin && (
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
            />
          </Box>
        </Stack>
      )}
      <Text fontSize="xl" fontWeight="bold">
        Filters
      </Text>
      {store.isAdmin && (
        <>
          <Button
            type="button"
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
          <Button type="button" onClick={onOpen}>
            Save
          </Button>
          {dashboard.published && (
            <Button onClick={() => togglePublish(dashboard, false)}>
              Unpublish
            </Button>
          )}
          {!dashboard.published && (
            <Button onClick={() => togglePublish(dashboard, true)}>
              Publish
            </Button>
          )}
        </>
      )}
      {dashboard.dataSet && (
        <DashboardCategorization dataSet={dashboard.dataSet} />
      )}
      <OUTreeSelect />
      <PeriodPicker
        selectedPeriods={store.periods}
        onChange={onChangePeriods}
      />
      {store.isAdmin && <AutoRefreshPicker />}

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
            <Button onClick={() => updateDashboard(dashboard)}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default DashboardMenu;
