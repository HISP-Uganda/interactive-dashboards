import { Input, Stack, Text, Textarea } from "@chakra-ui/react";
import { Event } from "effector";
import { ChangeEvent } from "react";
import { DataValueAttribute, IndicatorProps } from "../../interfaces";
import DHIS2 from "./DHIS2";
interface DHIS2Props extends IndicatorProps {
    dataSourceType?: string;
    changeQuery?: Event<DataValueAttribute>;
}
export const displayDataSourceType = ({
    denNum,
    onChange,
    dataSourceType,
    changeQuery,
}: DHIS2Props) => {
    const allTypes: { [key: string]: any } = {
        DHIS2: (
            <DHIS2
                denNum={denNum}
                onChange={onChange}
                changeQuery={changeQuery}
            />
        ),
        ELASTICSEARCH: (
            <Stack>
                <Text>Query</Text>
                <Textarea
                    rows={10}
                    value={denNum?.query}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        changeQuery
                            ? changeQuery({
                                  attribute: "query",
                                  value: e.target.value,
                              })
                            : null
                    }
                />
            </Stack>
        ),
        API: (
            <Stack>
                <Text>Accessor</Text>
                <Input
                    value={denNum?.accessor || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        changeQuery
                            ? changeQuery({
                                  attribute: "accessor",
                                  value: e.target.value,
                              })
                            : null
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
