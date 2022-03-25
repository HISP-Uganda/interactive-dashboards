import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import { ChangeEvent } from "react";
import { changeVisualizationType } from "../../Events";
import { $store } from "../../Store";
import NamespaceSelect from "../NamespaceSelect";
import SingleValueProperties from "../properties/SingleValueProperties";

type NewVisualizationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

const displayProperties = (visualizationType: string | undefined) => {
  const allTypes: any = {
    single: <SingleValueProperties />,
  };
  if (visualizationType) {
    return allTypes[visualizationType] || null;
  }
  return null;
};

const NewVisualizationDialog = ({
  isOpen,
  onClose,
}: NewVisualizationDialogProps) => {
  const store = useStore($store);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent m="48px">
        <ModalHeader>Visualization</ModalHeader>
        <ModalCloseButton />
        <ModalBody w="100%">
          <Stack direction="row" h="600px">
            <Stack w="40%">
              <Stack spacing="20px">
                <Stack>
                  <Text>Data Source</Text>
                  <NamespaceSelect namespace="i-data-sources" />
                </Stack>
                <Stack>
                  <Text>Visualization Type</Text>
                  <Select
                    value={store.visualization?.type}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      changeVisualizationType(e.target.value)
                    }
                  >
                    <option>Select Visualization Type</option>
                    <option value="single">Single Value</option>
                    <option value="map">Map</option>
                    <option value="bar">Bar</option>
                    <option value="stacked bar">Stacked Bar</option>
                    <option value="column">Column</option>
                    <option value="stacked column">Stacked Column</option>
                    <option value="pie">Pie</option>
                    <option value="line">Line</option>
                  </Select>
                </Stack>
                {displayProperties(store.visualization?.type)}
              </Stack>
              <Stack></Stack>
            </Stack>
            <Stack flex={1}>
              <Stack h="60%" overflow="auto">
                <pre>{JSON.stringify(store.visualization, null, 2)}</pre>
              </Stack>
              <Stack></Stack>
            </Stack>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Stack direction="row">
            <Button onClick={onClose} colorScheme="red">
              Close
            </Button>
            <Button colorScheme="blue">Save Visualization</Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewVisualizationDialog;
