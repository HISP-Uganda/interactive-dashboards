import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
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
} from "@chakra-ui/react";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { ChangeEvent } from "react";
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
import DashboardCategorization from "./forms/DashboardCategorization";
import OUTreeSelect from "./OUTreeSelect";
import PeriodPicker from "./PeriodPicker";
const DashboardMenu = () => {
  const search = useSearch<FormGenerics>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const dashboards = useStore($dashboards);
  const dataSets = useStore($dataSets);
  const store = useStore($store);
  const dashboard = useStore($dashboard);
  const categoryOptions = useStore($categoryOptions);
  const [loading, setLoading] = useState<boolean>(false);
  const updateDashboard = async (data: any) => {
    setLoading(true);
    await saveDocument("i-dashboards", store.systemId, data);
    await saveDocument("i-dashboard-settings", store.systemId, {
      default: store.defaultDashboard,
      id: store.systemId,
    });
    setLoading(() => false);
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

  const {
    isOpen: filterIsOpen,
    onOpen: onOpenFilter,
    onClose: onCloseFilter,
  } = useDisclosure();

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
        color="blue.600"
      >{`${dashboard.name} Dashboard`}</Text>
      <Spacer />
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
              size="sm"
            />
          </Box>
        </Stack>
      )}
      {store.isAdmin && (
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
      {store.isAdmin && <AutoRefreshPicker />}
      <Button colorScheme="teal" size="sm" onClick={onOpenFilter}>
        Filter
      </Button>

      <Drawer
        isOpen={filterIsOpen}
        placement="right"
        onClose={onCloseFilter}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filters</DrawerHeader>
          <DrawerBody>
            <Stack spacing="20px">
              <DashboardCategorization dataSet={dashboard.dataSet} />
              <OUTreeSelect />
              <PeriodPicker
                selectedPeriods={store.periods}
                onChange={onChangePeriods}
              />
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

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
