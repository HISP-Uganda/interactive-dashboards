import {
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useStore } from "effector-react";
import { IndicatorProps } from "../../interfaces";
import { $indicator } from "../../Store";
import DHIS2OrgUnitTree from "../DHIS2OrgUnitTree";
import DataElements from "./DataElements";
import Indicators from "./Indicators";
import OrganizationUnitGroups from "./OrganisationUnitGroups";
import OrganizationUnitLevels from "./OrganisationUnitLevels";
import Periods from "./Periods";
import ProgramIndicators from "./ProgramIndicators";
import SQLViews from "./SQLViews";

const DHIS2 = ({ onChange, denNum, changeQuery }: IndicatorProps) => {
  const indicator = useStore($indicator);
  return (
    <Stack>
      {denNum?.type === "ANALYTICS" && (
        <Tabs>
          <TabList>
            <Tab>Indicators</Tab>
            {!indicator.useInBuildIndicators && <Tab>Data Elements</Tab>}
            <Tab>Program Indicators</Tab>
            <Tab>Periods</Tab>
            <Tab>Organisation Units</Tab>
            <Tab>Organisation Groups</Tab>
            <Tab>Organisation Levels</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Indicators denNum={denNum} onChange={onChange} />
            </TabPanel>
            {!indicator.useInBuildIndicators && (
              <TabPanel>
                <DataElements denNum={denNum} onChange={onChange} />
              </TabPanel>
            )}
            <TabPanel>
              <ProgramIndicators denNum={denNum} onChange={onChange} />
            </TabPanel>
            <TabPanel>
              <Periods denNum={denNum} onChange={onChange} />
            </TabPanel>
            <TabPanel>
              {/* <OrgUnitTree
                expandedKeys={expandedKeys}
                initial={organisations}
                value={allOptions.length > 0 ? allOptions[0] : ""}
                onChange={(value) => console.log("Yes")}
              /> */}
              <DHIS2OrgUnitTree/>
            </TabPanel>
            <TabPanel>
              <OrganizationUnitGroups denNum={denNum} onChange={onChange} />
            </TabPanel>
            <TabPanel>
              <OrganizationUnitLevels denNum={denNum} onChange={onChange} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
      {denNum?.type === "SQL_VIEW" && (
        <SQLViews
          denNum={denNum}
          onChange={onChange}
          changeQuery={changeQuery}
        />
      )}
      {/* {denNum?.type === "OTHER" && <Text>Coming soon</Text>} */}
    </Stack>
  );
};

export default DHIS2;