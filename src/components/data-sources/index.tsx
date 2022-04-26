import { ChangeEvent } from "react";
import { Stack, Textarea, Text } from "@chakra-ui/react";
import { Event } from "effector";
import { IndicatorProps } from "../../interfaces";
import DHIS2 from "./DHIS2";
interface DHIS2Props extends IndicatorProps {
  dataSourceType?: string;
  changeQuery: Event<{
    attribute: "name" | "description" | "type" | "query";
    value: any;
  }>;
}
export const displayDataSourceType = ({
  denNum,
  onChange,
  dataSourceType,
  changeQuery,
}: DHIS2Props) => {
  const allTypes: { [key: string]: any } = {
    DHIS2: <DHIS2 denNum={denNum} onChange={onChange} />,
    ELASTICSEARCH: (
      <Stack>
        <Text>Query</Text>
        <Textarea
          rows={10}
          value={denNum.query}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            changeQuery({ attribute: "query", value: e.target.value })
          }
        />
      </Stack>
    ),
  };
  if (dataSourceType) {
    return allTypes[dataSourceType] || null;
  }
  return null;
};
