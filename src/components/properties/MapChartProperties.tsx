import {
  IconButton,
  Input,
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
  Radio,
  RadioGroup,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { ChangeEvent, useRef, useState } from "react";
import { SwatchesPicker } from "react-color";
import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import useOnClickOutside from "use-onclickoutside";
import { changeVisualizationProperties } from "../../Events";
import { IVisualization, Option } from "../../interfaces";
import { $visualizationData } from "../../Store";
import { generateUid } from "../../utils/uid";
import { fromPairs } from "lodash";
import { createOptions } from "./AvialableOptions";

type Threshold = { [key: string]: [number, string] };

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
  const [id, setId] = useState<string>("");
  const [thresholds, setThresholds] = useState<Threshold>(
    visualization.properties?.["data.mapKeys"] || {}
  );
  const { isOpen, onClose, onOpen } = useDisclosure();
  const ref = useRef(null);
  const addThreshold = () => {
    const threshold: Threshold = { [generateUid()]: [0, "#333"] };
    const all = { ...thresholds, ...threshold };
    changeVisualizationProperties({
      visualization: visualization.id,
      attribute: "data.mapKeys",
      value: all,
    });
    setThresholds(all);
  };

  const removeThreshold = (id: string) => {
    const filtered = Object.entries(thresholds).filter(([key]) => key !== id);
    changeVisualizationProperties({
      visualization: visualization.id,
      attribute: "data.mapKeys",
      value: fromPairs(filtered),
    });
    setThresholds(fromPairs(filtered));
  };
  useOnClickOutside(ref, onClose);
  const changeThreshold = (
    id: string,
    attribute: "color" | "min",
    value: string | number
  ) => {
    const processed = Object.entries(thresholds).map(([key, values]) => {
      if (key === id) {
        if (attribute === "color") {
          return [key, [values[0], value]];
        }
        return [key, [value, values[1]]];
      }
      return [key, values];
    });
    changeVisualizationProperties({
      visualization: visualization.id,
      attribute: "data.mapKeys",
      value: fromPairs(processed),
    });
    setThresholds(fromPairs(processed));
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
            {Object.entries(thresholds).map(([key, values]) => (
              <Tr key={key}>
                <Td w="35%">
                  <NumberInput
                    value={values[0]}
                    step={0.1}
                    max={1}
                    min={0}
                    onChange={(value1: string, value2: number) =>
                      changeThreshold(key, "min", value2)
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
                  bg={values[1]}
                  position="relative"
                  onClick={() => {
                    setId(key);
                    onOpen();
                  }}
                >
                  {isOpen && id === key && (
                    <SwatchesPicker
                      key={key}
                      color={values[1]}
                      onChangeComplete={(color) => {
                        changeThreshold(key, "color", color.hex);
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
                    onClick={() => removeThreshold(key)}
                  />
                </Td>
              </Tr>
            ))}
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
    </Stack>
  );
};

export default MapChartProperties;
