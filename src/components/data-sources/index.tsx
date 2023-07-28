import { Input, Stack, Text, Textarea } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { ChangeEvent } from "react";
import { datumAPi } from "../../Events";
import { $visualizationQuery } from "../../Store";
import DHIS2 from "./DHIS2";
import { IDataSource } from "../../interfaces";
export const DisplayDataSourceType = ({
    dataSource,
}: {
    dataSource: IDataSource | null | undefined;
}) => {
    const visualizationQuery = useStore($visualizationQuery);
    const allTypes: { [key: string]: any } = {
        DHIS2: <DHIS2 dataSource={dataSource} />,
        ELASTICSEARCH: (
            <Stack>
                <Text>Query</Text>
                <Textarea
                    rows={10}
                    value={visualizationQuery.query}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        datumAPi.changeAttribute({
                            attribute: "query",
                            value: e.target.value,
                        })
                    }
                />
            </Stack>
        ),
        API: (
            <Stack>
                <Text>Accessor</Text>
                <Input
                    value={visualizationQuery.accessor}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        datumAPi.changeAttribute({
                            attribute: "accessor",
                            value: e.target.value,
                        })
                    }
                />
            </Stack>
        ),
    };
    if (dataSource?.type) {
        return allTypes[dataSource.type] || null;
    }
    return null;
};
