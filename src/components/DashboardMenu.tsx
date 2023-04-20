import {
    Box,
    Button,
    Checkbox,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
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
    useMediaQuery,
    useToast,
} from "@chakra-ui/react";
import { DropdownButton } from "@dhis2/ui";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { ChangeEvent, useState } from "react";
import { db } from "../db";
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
    setHasChildren,
    setNodeSource,
    setOrganisations,
    setRefresh,
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
    $settings,
} from "../Store";
import { generateUid } from "../utils/uid";
import AutoRefreshPicker from "./AutoRefreshPicker";
import OUTree from "./OUTree";
import PeriodPicker from "./PeriodPicker";
import { useDataEngine } from "@dhis2/app-runtime";

const searchOptions: Option[] = [
    { label: "Data Element", value: "de" },
    { label: "Data Element Group", value: "deg" },
    { label: "Data Element Group Set", value: "degs" },
];

const DashboardMenu = () => {
    const search = useSearch<LocationGenerics>();
    const toast = useToast();
    const engine = useDataEngine();
    const { storage } = useStore($settings);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isOpenSettings,
        onOpen: onOpenSettings,
        onClose: onCloseSettings,
    } = useDisclosure();
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
        await saveDocument(
            storage,
            "i-dashboards",
            store.systemId,
            data,
            engine,
            "create"
        );
        const setting = {
            default: store.defaultDashboard,
            id: store.systemId,
        };
        await saveDocument(
            storage,
            "i-dashboard-settings",
            store.systemId,
            setting,
            engine,
            "create"
        );
        setLoading(() => false);
        setRefresh(true);
        onClose();
    };

    const togglePublish = async (data: IDashboard, value: boolean) => {
        await saveDocument(
            storage,
            "i-dashboards",
            store.systemId,
            {
                ...data,
                published: true,
            },
            engine,
            "create"
        );
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

    const changeNodeSource = (
        value: string,
        field: "resource" | "fields" | "search" | "subSearch"
    ) => {
        setNodeSource({ value, field });
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
                fontSize="2.5vh"
                fontWeight="700"
                noOfLines={1}
            >{`${dashboard.name}`}</Text>
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
                        <Button
                            size="sm"
                            onClick={() => togglePublish(dashboard, false)}
                        >
                            Unpublish
                        </Button>
                    )}
                    {!dashboard.published && (
                        <Button
                            size="sm"
                            onClick={() => togglePublish(dashboard, true)}
                        >
                            Publish
                        </Button>
                    )}
                </>
            )}
            {store.isAdmin && !isNotDesktop && <AutoRefreshPicker />}
            <DropdownButton
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
                        <Text fontSize="2xl" color="yellow.500">
                            Votes
                        </Text>
                        <OUTree
                            value={store.organisations}
                            onChange={(value) => setOrganisations(value)}
                        />
                        <PeriodPicker
                            selectedPeriods={store.periods}
                            onChange={onChangePeriods}
                        />
                    </Stack>
                }
                style={{ backgroundColor: "yellow" }}
                name="buttonName"
                value="buttonValue"
                className="nrm"
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
                                            (d: Option) =>
                                                d.value === dashboard.dataSet
                                        )}
                                        onChange={(e) =>
                                            assignDataSet(e?.value || "")
                                        }
                                        size="sm"
                                    />
                                </Box>
                            </Stack>
                            <Checkbox
                                onChange={async (
                                    e: ChangeEvent<HTMLInputElement>
                                ) => {
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
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) =>
                                        changeNodeSource(
                                            e.target.value,
                                            "resource"
                                        )
                                    }
                                />
                            </Stack>
                            <Stack>
                                <Text>Fields</Text>
                                <Input
                                    value={dashboard.nodeSource?.fields || ""}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) =>
                                        changeNodeSource(
                                            e.target.value,
                                            "fields"
                                        )
                                    }
                                />
                            </Stack>
                            <Stack>
                                <Text>Search</Text>
                                <Select<Option, false, GroupBase<Option>>
                                    options={searchOptions}
                                    value={searchOptions.find(
                                        (d: Option) =>
                                            dashboard.nodeSource &&
                                            d.value ===
                                                dashboard.nodeSource.search
                                    )}
                                    onChange={(e) =>
                                        changeNodeSource(
                                            e?.value || "",
                                            "search"
                                        )
                                    }
                                    menuPlacement="auto"
                                />
                            </Stack>
                            <Stack>
                                <Text>Sub-Search</Text>
                                <Select<Option, false, GroupBase<Option>>
                                    options={searchOptions}
                                    value={searchOptions.find(
                                        (d: Option) =>
                                            dashboard.nodeSource &&
                                            d.value ===
                                                dashboard.nodeSource.subSearch
                                    )}
                                    onChange={(e) =>
                                        changeNodeSource(
                                            e?.value || "",
                                            "subSearch"
                                        )
                                    }
                                    menuPlacement="top"
                                />
                            </Stack>
                            <Button
                                onClick={async () => {
                                    await db.dashboards.bulkPut([
                                        {
                                            isLeaf: !dashboard.hasChildren,
                                            pId: "",
                                            key: dashboard.id,
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
                                        description:
                                            "Dashboard saved successfully",
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
                    Options
                </DropdownButton>
            )}

            {store.isAdmin && !isNotDesktop && (
                <Button onClick={() => onOpenSettings()}>Settings</Button>
            )}

            <Drawer
                isOpen={isOpenSettings}
                placement="right"
                onClose={onCloseSettings}
                // finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Create your account</DrawerHeader>

                    <DrawerBody>
                        <Input placeholder="Type here..." />
                    </DrawerBody>

                    <DrawerFooter>
                        <Button
                            variant="outline"
                            mr={3}
                            onClick={onCloseSettings}
                        >
                            Cancel
                        </Button>
                        <Button colorScheme="blue">Save</Button>
                    </DrawerFooter>
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
                                        (d: Option) =>
                                            d.value === dashboard.category
                                    )}
                                    onChange={(e) =>
                                        changeCategory(e?.value || "")
                                    }
                                />
                            </Stack>
                            <Stack>
                                <Text>Name</Text>
                                <Input
                                    value={dashboard.name}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) => changeDashboardName(e.target.value)}
                                />
                            </Stack>
                            <Stack>
                                <Text>Description</Text>
                                <Textarea
                                    value={dashboard.description}
                                    onChange={(
                                        e: ChangeEvent<HTMLTextAreaElement>
                                    ) =>
                                        changeDashboardDescription(
                                            e.target.value
                                        )
                                    }
                                />
                            </Stack>
                            <Stack>
                                <Checkbox
                                    isChecked={
                                        store.defaultDashboard === dashboard.id
                                    }
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) =>
                                        setDefaultDashboard(
                                            e.target.checked ? dashboard.id : ""
                                        )
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
