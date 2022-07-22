import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { ChangeEvent, useRef, useState } from "react";
import { SwatchesPicker } from "react-color";
import useOnClickOutside from "use-onclickoutside";
import { changeVisualizationProperties } from "../../Events";
import { IVisualization, Option } from "../../interfaces";
import { generateUid } from "../../utils/uid";

type Threshold = { id: string; min: string; max: string; color: string };

const numberFormats: Option[] = [
  {
    label: "Zero decimals Short form",
    value: ".0s",
  },
  {
    label: "1 decimal Short form",
    value: ".1s",
  },
  {
    label: "2 decimal Short form",
    value: ".2s",
  },
  {
    label: "any decimal Short form",
    value: "~s",
  },
  {
    label: "Zero decimals full number",
    value: ".0f",
  },
  {
    label: "1 Decimal full number",
    value: ".1f",
  },
  {
    label: "2 Decimal full number",
    value: ".2f",
  },
];
const progressAlignments: Option[] = [
  {
    label: "Column",
    value: "column",
  },
  {
    label: "Column Reverse",
    value: "column-reverse",
  },
  {
    label: "Row",
    value: "row",
  },
  {
    label: "Row Reverse",
    value: "row-reverse",
  },
];

const SingleValueProperties = ({
  visualization,
}: {
  visualization: IVisualization;
}) => {
  const [id, setId] = useState<string>("");
  const [thresholds, setThresholds] = useState<Threshold[]>(
    visualization.properties["data.thresholds"] || []
  );
  const { isOpen, onClose, onOpen } = useDisclosure();
  const ref = useRef(null);
  const addThreshold = () => {
    const threshold: Threshold = {
      id: generateUid(),
      color: "#333",
      min: "50",
      max: "100",
    };
    const all = [...thresholds, threshold];
    changeVisualizationProperties({
      visualization: visualization.id,
      attribute: "data.thresholds",
      value: all,
    });
    setThresholds(all);
  };

  const removeThreshold = (id: string) => {
    const filtered = thresholds.filter((threshold) => threshold.id === id);
    changeVisualizationProperties({
      visualization: visualization.id,
      attribute: "data.thresholds",
      value: filtered,
    });
    setThresholds(filtered);
  };
  useOnClickOutside(ref, onClose);
  const changeThreshold = (
    id: string,
    attribute: "color" | "min" | "max",
    value: string
  ) => {
    const processed = thresholds.map((threshold) => {
      if (threshold.id === id) {
        return { ...threshold, [attribute]: value };
      }
      return threshold;
    });
    changeVisualizationProperties({
      visualization: visualization.id,
      attribute: "data.thresholds",
      value: processed,
    });
    setThresholds(processed);
  };

  return (
    <Stack>
      <Text>Prefix</Text>
      <Input
        value={visualization.properties["data.prefix"] || ""}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "data.prefix",
            value: e.target.value,
          })
        }
      />
      <Text>Suffix</Text>
      <Input
        value={visualization.properties["data.suffix"] || ""}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "data.suffix",
            value: e.target.value,
          })
        }
      />
      <Text>Number format</Text>
      <Select<Option, false, GroupBase<Option>>
        value={numberFormats.find(
          (pt) => pt.value === visualization.properties["data.valueformat"]
        )}
        onChange={(e) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "data.valueformat",
            value: e?.value,
          })
        }
        options={numberFormats}
        isClearable
      />
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
              <Th>Max</Th>
              <Th>Color</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody ref={ref}>
            {thresholds.map((hold) => (
              <Tr key={hold.id}>
                <Td w="35%">
                  <Input
                    value={hold.min}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      changeThreshold(hold.id, "min", e.target.value)
                    }
                  />
                </Td>
                <Td w="35%">
                  <Input
                    value={hold.max}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      changeThreshold(hold.id, "max", e.target.value)
                    }
                  />
                </Td>
                <Td
                  w="20%"
                  bg={hold.color}
                  position="relative"
                  onClick={() => {
                    setId(hold.id);
                    onOpen();
                  }}
                >
                  {isOpen && id === hold.id && (
                    <SwatchesPicker
                      key={hold.id}
                      color={hold.color}
                      onChangeComplete={(color) => {
                        console.log(color);
                        changeThreshold(hold.id, "color", color.hex);
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
                    onClick={() => removeThreshold(hold.id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Text>Target</Text>
      <Input
        value={visualization.properties["data.target"] || ""}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "data.target",
            value: e.target.value,
          })
        }
      />
      <Text>Target Graph</Text>
      <RadioGroup
        onChange={(e: string) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "data.targetgraph",
            value: e,
          })
        }
        value={visualization.properties["data.targetgraph"]}
      >
        <Stack direction="row">
          <Radio value="progress">Progress</Radio>
          <Radio value="circular">Circular Progress</Radio>
        </Stack>
      </RadioGroup>

      <Text>Target Direction</Text>
      <Select<Option, false, GroupBase<Option>>
        value={progressAlignments.find(
          (pt) => pt.value === visualization.properties["data.direction"]
        )}
        onChange={(e) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "data.direction",
            value: e?.value,
          })
        }
        options={progressAlignments}
        isClearable
      />
    </Stack>
  );
};

export default SingleValueProperties;
