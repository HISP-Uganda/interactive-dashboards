import React from "react";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

const DHIS2 = () => {
  return (
    <Tabs>
      <TabList>
        <Tab>Indicators</Tab>
        <Tab>DataElements</Tab>
        <Tab>SQL Views</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <p>one!</p>
        </TabPanel>
        <TabPanel>
          <p>two!</p>
        </TabPanel>
        <TabPanel>
          <p>two!</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default DHIS2;
