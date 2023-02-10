import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Spacer,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useNavigate } from "@tanstack/react-location";
import { EventDataNode } from "antd/es/tree";
import { useStore } from "effector-react";
import { uniq } from "lodash";
import { useEffect, useState } from "react";
import { db } from "../../db";
import {
  changeSelectedCategory,
  changeSelectedDashboard,
  setColumns,
  setCurrentDashboard,
  setDataElements,
  setOriginalColumns,
  setRefresh,
  setRows,
  updateVisualizationData,
} from "../../Events";
import { DataNode, IDashboard } from "../../interfaces";
import { deleteDocument, useDashboards } from "../../Queries";
import { $store } from "../../Store";
import { generateUid } from "../../utils/uid";
import { generalPadding, otherHeight } from "../constants";
import { loadData } from "../helpers";
import LoadingIndicator from "../LoadingIndicator";

const Dashboards = () => {
  const navigate = useNavigate();
  const store = useStore($store);
  const engine = useDataEngine();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<string>("");
  const { isLoading, isSuccess, isError, error, data } = useDashboards(
    store.systemId
  );

  const [response, setResponse] = useState<IDashboard[] | undefined>(data);

  const deleteResource = async (id: string) => {
    setCurrentId(() => id);
    setLoading(() => true);
    await deleteDocument("i-dashboards", id);
    setResponse((prev) => prev?.filter((p) => p.id !== id));
    setLoading(() => false);
  };

  useEffect(() => {
    setResponse(() => data);
  }, [data]);

  return (
    <Stack
      p={`${generalPadding}px`}
      bgColor="white"
      flex={1}
      h={otherHeight}
      maxH={otherHeight}
    >
      <Stack direction="row">
        <Spacer />
        <Button
          onClick={() => {
            setRefresh(true);
            navigate({
              to: `/dashboards/${generateUid()}`,
              search: {
                periods: store.periods.map((i) => i.id).join("-"),
                organisations: store.organisations.join("-"),
                groups: store.groups.join("-"),
                levels: store.levels.join("-"),
              },
            });
          }}
          colorScheme="blue"
        >
          <AddIcon mr="2" />
          Add Dashboard
        </Button>
      </Stack>
      <Divider borderColor="blue.500" />
      <Stack alignContent="center" alignItems="center" flex={1}>
        {isLoading && <LoadingIndicator />}
        {isSuccess && (
          <Table variant="striped" w="100%">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Category</Th>
                <Th>Published</Th>
                <Th>Refresh Interval</Th>
                <Th>Description</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {response?.map((dashboard: IDashboard) => (
                <Tr
                  key={dashboard.id}
                  cursor="pointer"
                  onClick={async () => {
                    setCurrentDashboard(dashboard);
                    changeSelectedDashboard(dashboard.id);
                    changeSelectedCategory(dashboard.category || "");
                    const node: EventDataNode<DataNode> = {
                      isLeaf: !dashboard.hasChildren,
                      id: dashboard.id,
                      pId: "",
                      key: dashboard.id,
                      style: { margin: "5px" },
                      title: dashboard.name || "",
                      checkable: false,
                      nodeSource: dashboard.nodeSource,
                      hasChildren: dashboard.hasChildren,

                      expanded: false,
                      selected: false,
                      checked: false,
                      loaded: false,
                      loading: false,
                      halfChecked: false,
                      dragOver: false,
                      dragOverGapTop: false,
                      dragOverGapBottom: false,
                      pos: "",
                      active: false,
                    };
                    const children = await loadData(node, engine);
                    setOriginalColumns([
                      { id: "title", title: "Indicator" },
                      { id: "totalIndicators", title: "# Indicators" },
                    ]);
                    setColumns([
                      { id: "a", title: "A" },
                      { id: "b", title: "MA" },
                      { id: "c", title: "NA" },
                    ]);
                    const elements = await db.dataElements.toArray();
                    setDataElements(elements);
                    setRows(
                      children.map((c: any) => {
                        const filteredElements = elements.filter(
                          (e) =>
                            e.interventionCode === c.key ||
                            e.themeCode === c.key ||
                            e.programCode === c.key
                        );
                        return {
                          ...c,
                          child: false,
                          totalIndicators: filteredElements.length,
                          elements: filteredElements.map(({ id }) => id),
                        };
                      })
                    );
                    updateVisualizationData({
                      visualizationId: "keyResultAreas",
                      data: [
                        {
                          value: uniq(elements.map((e) => e.keyResultAreaCode))
                            .length,
                        },
                      ],
                    });
                    updateVisualizationData({
                      visualizationId: "indicators",
                      data: [{ value: elements.length }],
                    });
                    updateVisualizationData({
                      visualizationId: "interventions",
                      data: [
                        {
                          value: uniq(elements.map((e) => e.interventionCode))
                            .length,
                        },
                      ],
                    });
                    updateVisualizationData({
                      visualizationId: "outputs",
                      data: [{ value: 0 }],
                    });
                    navigate({
                      to: `/dashboards/${dashboard.id}`,
                      search: {
                        edit: true,
                        category: dashboard.category,
                        periods: store.periods.map((i) => i.id).join("-"),
                        organisations: store.organisations.join("-"),
                        groups: store.groups.join("-"),
                        levels: store.levels.join("-"),
                      },
                    });
                  }}
                >
                  <Td>{dashboard.name}</Td>
                  <Td>{dashboard.category}</Td>
                  <Td>{dashboard.published ? "Yes" : "No"}</Td>
                  <Td>{dashboard.refreshInterval}</Td>
                  <Td>{dashboard.description}</Td>
                  <Td>
                    <Stack direction="row" spacing="5px">
                      <Button colorScheme="green" size="xs">
                        View
                      </Button>
                      <Button size="xs">Duplicate</Button>
                      <Button
                        colorScheme="red"
                        size="xs"
                        isLoading={loading && currentId === dashboard.id}
                        onClick={() => deleteResource(dashboard.id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
        {isError && <Text>No data/Error occurred</Text>}
      </Stack>
    </Stack>
  );
};

export default Dashboards;
