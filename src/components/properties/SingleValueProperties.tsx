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
} from "@chakra-ui/react";
import { ChangeEvent, useRef, useState } from "react";
import { SwatchesPicker } from "react-color";
import useOnClickOutside from "use-onclickoutside";
import { changeVisualizationProperties } from "../../Events";
import { IVisualization } from "../../interfaces";
import { generateUid } from "../../utils/uid";

type Threshold = { id: string; min: string; max: string; color: string };

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
    </Stack>
  );
};

export default SingleValueProperties;
