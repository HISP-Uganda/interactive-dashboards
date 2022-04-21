import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { $store } from "../../Store";
import { displayDataSourceType } from "../data-sources";
const SingleValueProperties = () => {
  const store = useStore($store);
  return (
    <Tabs>
      <TabList>
        <Tab>General</Tab>
        <Tab>Properties</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          {/* {displayDataSourceType(store.visualization?.dataSource?.type)} */}
        </TabPanel>
        <TabPanel>
          <p>two!</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default SingleValueProperties;
