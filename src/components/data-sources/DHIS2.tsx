import React from "react";

import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
  Text,
} from "@chakra-ui/react";
import DataElements from "./DataElements";
import Indicators from "./Indicators";
import SQLViews from "./SQLViews";
import ProgramIndicators from "./ProgramIndicators";
import { IndicatorProps } from "../../interfaces";

const DHIS2 = ({ onChange, denNum }: IndicatorProps) => {
  return (
    <Stack>
      {denNum.type === "ANALYTICS" && (
        <Tabs>
          <TabList>
            <Tab>Indicators</Tab>
            <Tab>Data Elements</Tab>
            <Tab>Program Indicators</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Indicators denNum={denNum} onChange={onChange} />
            </TabPanel>
            <TabPanel>
              <DataElements denNum={denNum} onChange={onChange} />
            </TabPanel>
            <TabPanel>
              <ProgramIndicators denNum={denNum} onChange={onChange} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}

      {denNum.type === "SQL_VIEW" && <SQLViews />}
      {denNum.type === "OTHER" && <Text>Coming soon</Text>}
    </Stack>
  );
};

export default DHIS2;
