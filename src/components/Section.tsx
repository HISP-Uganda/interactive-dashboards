import {
  Button,
  Spacer,
  Stack,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  IconButton,
  Textarea,
  Input,
  Select,
} from "@chakra-ui/react";
import { MdKeyboardBackspace } from "react-icons/md";
import React from "react";
import { addVisualization2Section, setShowSider } from "../Events";
import { $dashboard, $section } from "../Store";
import { useStore } from "effector-react";
import { IVisualization } from "../interfaces";

const VisualizationTypes = () => {
  return (
    <Stack>
      <Text>Visualization Type</Text>
      <Select>
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
  );
};

const Section = () => {
  const section = useStore($section);
  const dashboard = useStore($dashboard);
  setShowSider(false);
  return (
    <Stack flex={1} p="10px">
      <Stack direction="row">
        <Stack direction="row" alignItems="center" justifyItems="center">
          <IconButton
            bg="none"
            _hover={{ bg: "none" }}
            aria-label="Search database"
            icon={<MdKeyboardBackspace />}
          />
          <Stack direction="row" spacing="2px">
            <Text>{dashboard.name}</Text>
            <Text>/</Text>
            <Text>Edit Section</Text>
          </Stack>
        </Stack>
        <Spacer />
        <Stack direction="row" alignItems="center" justifyItems="center">
          <Button>Discard</Button>
          <Button>Save</Button>
          <Button>Apply</Button>
        </Stack>
      </Stack>
      <Stack></Stack>
      <Stack direction="row" spacing="20px">
        <Stack w="75%" bg="yellow.100">
          <Text>AAA</Text>
        </Stack>
        <Stack w="25%">
          <Accordion>
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Section options
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Stack>
                  <Text>Title</Text>
                  <Input />
                </Stack>
                <Stack>
                  <Text>Description</Text>
                  <Textarea />
                </Stack>
              </AccordionPanel>
            </AccordionItem>
            {section?.visualizations.map((visualization: IVisualization) => (
              <AccordionItem key={visualization.id}>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    {visualization.name}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <VisualizationTypes />

                  <Accordion>
                    <AccordionItem>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          Visualization options
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4}></AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
          <pre>{JSON.stringify(dashboard, null, 2)}</pre>
          <Button onClick={() => addVisualization2Section()}>
            Add Visualization
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Section;
