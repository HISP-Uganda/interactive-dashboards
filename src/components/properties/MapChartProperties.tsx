import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spacer,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { fromPairs, orderBy } from "lodash";
import { useRef, useState } from "react";
import { SwatchesPicker } from "react-color";
import useOnClickOutside from "use-onclickoutside";
import { changeVisualizationProperties } from "../../Events";
import { IVisualization, Option } from "../../interfaces";
import { generateUid } from "../../utils/uid";
import { createOptions } from "../../utils/utils";

type Threshold = { key: number; value: string; id: string };
const mapStyleOptions = createOptions([
  "carto-darkmatter",
  "carto-positron",
  "open-street-map",
  "stamen-terrain",
  "stamen-toner",
  "stamen-watercolor",
  "white-bg",
]);

const MapChartProperties = ({
  visualization,
}: {
  visualization: IVisualization;
}) => {
  const [currentId, setCurrentId] = useState<string>("");
  const { isOpen, onClose, onOpen } = useDisclosure();
  const ref = useRef(null);
  const addThreshold = () => {
    changeVisualizationProperties({
      visualization: visualization.id,
      attribute: "data.mapKeys",
      value: [
        ...(visualization.properties["data.mapKeys"] || []),
        { id: generateUid(), key: 0, value: "#333" },
      ],
    });
  };

  console.log(visualization.properties);
  const removeThreshold = (uid: string) => {
    const filtered = (visualization.properties["data.mapKeys"] || []).filter(
      ({ id }: Threshold) => uid !== id
    );
    changeVisualizationProperties({
      visualization: visualization.id,
      attribute: "data.mapKeys",
      value: filtered,
    });
  };
  useOnClickOutside(ref, onClose);
  const changeThreshold = (
    uid: string,
    attribute: "color" | "min",
    value: string | number
  ) => {
    const processed = (visualization.properties["data.mapKeys"] || []).map(
      (threshold: Threshold) => {
        if (uid === threshold.id) {
          if (attribute === "color") {
            return { ...threshold, value };
          }
          return { ...threshold, key: value };
        }
        return threshold;
      }
    );
    changeVisualizationProperties({
      visualization: visualization.id,
      attribute: "data.mapKeys",
      value: processed,
    });
  };

  return (
    <Stack>
      <Stack direction="row" alignItems="center">
        <Text>Threshold</Text>
        <Spacer />
        <IconButton
          bg="none"
          aria-label="add"
          icon={<AddIcon w={2} h={2} />}
          onClick={() => addThreshold()}
        />
      </Stack>
      <TableContainer>
        <Table variant="simple" size="xs">
          <Thead>
            <Tr>
              <Th>Min</Th>
              <Th>Color</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody ref={ref}>
            {(visualization.properties?.["data.mapKeys"] || []).map(
              ({ key, value, id }: any) => (
                <Tr key={id}>
                  <Td w="35%">
                    <NumberInput
                      value={key}
                      step={0.05}
                      max={1}
                      min={0}
                      onChange={(value1: string, value2: number) =>
                        changeThreshold(id, "min", value2)
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </Td>
                  <Td
                    w="20%"
                    bg={value}
                    position="relative"
                    onClick={() => {
                      setCurrentId(id);
                      onOpen();
                    }}
                  >
                    {isOpen && id === currentId && (
                      <SwatchesPicker
                        key={id}
                        color={value}
                        onChangeComplete={(color) => {
                          changeThreshold(id, "color", color.hex);
                          onClose();
                        }}
                      />
                    )}
                  </Td>
                  <Td textAlign="right" w="10%">
                    <IconButton
                      aria-label="delete"
                      bg="none"
                      icon={<DeleteIcon w={3} h={3} />}
                      onClick={() => removeThreshold(id)}
                    />
                  </Td>
                </Tr>
              )
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <Text>Map Style</Text>
      <Select<Option, false, GroupBase<Option>>
        value={mapStyleOptions.find(
          (pt) => pt.value === visualization.properties?.["layout.mapbox.style"]
        )}
        onChange={(e) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "layout.mapbox.style",
            value: e?.value,
          })
        }
        options={mapStyleOptions}
        isClearable
      />
      <Text>Zoom</Text>

      <NumberInput
        value={visualization.properties?.["layout.zoom"] || 5.3}
        step={0.1}
        max={20}
        min={5.3}
        onChange={(value1: string, value2: number) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "layout.zoom",
            value: value2,
          })
        }
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </Stack>
  );
};

export default MapChartProperties;
