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
  useToast,
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
  setHasChildren,
  setNodeSource,
  setVersion,
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
import OUTree from "./OUTree";
import { db } from "../db";
import { generateUid } from "../utils/uid";

const DashboardMenu = () => {
  const search = useSearch<LocationGenerics>();
  const toast = useToast();

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

  const changeNodeSource = (value: string, field: "resource" | "fields") => {
    setNodeSource({
      resource: dashboard.nodeSource?.resource || "",
      fields: dashboard.nodeSource?.fields,
      [field]: value,
    });
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
        color="blue.600"
        noOfLines={1}
      >{`${dashboard.name} Dashboard`}</Text>
      <Spacer />
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
        primary
        component={
          <Stack
            w="600px"
            p="15px"
            mt="7px"
            bg="white"
            boxShadow="2xl"
            overflow="auto"
            h="calc(100vh - 170px)"
          >
            {/* <DashboardCategorization dataSet={dashboard.dataSet} /> */}
            <Text>Organisation</Text>
            <OUTree
              value={store.organisations}
              onChange={(value) => setOrganisations(value)}
            />

            {/* <PeriodPicker
              selectedPeriods={store.periods}
              onChange={onChangePeriods}
            /> */}
          </Stack>
        }
        name="buttonName"
        value="buttonValue"
      >
        Filter
      </DropdownButton>

      {store.isAdmin && !isNotDesktop && (
        <DropdownButton
          primary
          component={
            <Stack
              w="400px"
              p="15px"
              mt="7px"
              bg="white"
              boxShadow="2xl"
              spacing="20px"
              // borderTopRadius="lg"
              overflow="auto"
            >
              <Stack>
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
              <Checkbox
                onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                  e.persist();
                  setHasChildren(e.target.checked);
                }}
                isChecked={dashboard.hasChildren}
              >
                Has Children
              </Checkbox>
              <Stack>
                <Text>Node Source</Text>
                <Input
                  value={dashboard.nodeSource?.resource || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    changeNodeSource(e.target.value, "resource")
                  }
                />
              </Stack>
              <Stack>
                <Text>Fields</Text>
                <Input
                  value={dashboard.nodeSource?.fields || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    changeNodeSource(e.target.value, "fields")
                  }
                />
              </Stack>
              <Button
                onClick={async () => {
                  console.log(dashboard.nodeSource);
                  await db.dashboards.bulkPut([
                    {
                      isLeaf: !dashboard.hasChildren,
                      pId: "",
                      key: dashboard.id,
                      style: { margin: "5px" },
                      title: dashboard.name || "",
                      checkable: false,
                      nodeSource: dashboard.nodeSource,
                      hasChildren: dashboard.hasChildren,
                    },
                  ]);
                  setVersion(generateUid());
                  await updateDashboard(dashboard);
                  toast({
                    title: "Dashboard.",
                    description: "Dashboard saved successfully",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                  });
                }}
              >
                Update
              </Button>
            </Stack>
          }
          name="buttonName"
          value="buttonValue"
        >
          Settings
        </DropdownButton>
      )}

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
