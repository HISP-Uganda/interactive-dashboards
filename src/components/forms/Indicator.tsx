import {
  Box,
  Button,
  Checkbox,
  Input,
  Spacer,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useNavigate, useSearch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { ChangeEvent, useState } from "react";
import { useQueryClient } from "react-query";
import {
  changeIndicatorAttribute,
  changeNumeratorDimension,
  changeUseIndicators,
  setIndicator,
} from "../../Events";
import { FormGenerics } from "../../interfaces";
import {
  $dataSourceType,
  $hasDHIS2,
  $indicator,
  createIndicator,
} from "../../Store";
import { displayDataSourceType } from "../data-sources";
import NamespaceSelect from "../NamespaceSelect";

import "jsoneditor-react/es/editor.min.css";

const Indicator = () => {
  const search = useSearch<FormGenerics>();
  const indicator = useStore($indicator);
  const hasDHIS2 = useStore($hasDHIS2);
  const dataSourceType = useStore($dataSourceType);
  const [loading, setLoading] = useState<boolean>(false);
  const engine = useDataEngine();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const add = async () => {
    setLoading(true);
    let mutation: any = {
      type: "create",
      resource: `dataStore/i-visualization-queries/${indicator.id}`,
      data: indicator,
    };
    if (search.edit) {
      mutation = {
        type: "update",
        resource: `dataStore/i-visualization-queries`,
        id: indicator.id,
        data: indicator,
      };
    }
    await engine.mutate(mutation);
    await queryClient.invalidateQueries(["visualization-queries"]);
    setLoading(false);
    navigate({ to: "/indicators" });
  };

  return (
    <Box flex={1} p="20px" bg="white">
      <Stack spacing="20px">
        <Stack>
          <Text>Data Source</Text>
          <NamespaceSelect />
        </Stack>
        {hasDHIS2 && (
          <Checkbox
            isChecked={indicator.useInBuildIndicators}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              changeUseIndicators(e.target.checked)
            }
          >
            Use DHIS2 Indicators
          </Checkbox>
        )}
        <Stack>
          <Text>Name</Text>
          <Input
            value={indicator.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              changeIndicatorAttribute({
                attribute: "name",
                value: e.target.value,
              })
            }
          />
        </Stack>
        {indicator.useInBuildIndicators ? (
          <Stack>
            {displayDataSourceType({
              dataSourceType,
              onChange: changeNumeratorDimension,
              denNum: indicator.numerator,
            })}
          </Stack>
        ) : (
          <>
            <Stack>
              <Text>Description</Text>
              <Textarea
                value={indicator.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  changeIndicatorAttribute({
                    attribute: "description",
                    value: e.target.value,
                  })
                }
              />
            </Stack>
            <Stack>
              <Text>Factor Expression</Text>
              <Input
                value={indicator.factor}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  changeIndicatorAttribute({
                    attribute: "factor",
                    value: e.target.value,
                  })
                }
              />
            </Stack>

            {dataSourceType === "ELASTICSEARCH" && (
              <Stack>
                <Text>Query</Text>
                <Textarea
                  rows={20}
                  value={indicator.query}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    changeIndicatorAttribute({
                      attribute: "query",
                      value: e.target.value,
                    })
                  }
                />
              </Stack>
            )}
            {dataSourceType !== "ELASTICSEARCH" && (
              <Stack direction="row" spacing="50px">
                <Button
                  onClick={() =>
                    navigate({
                      to: `/indicators/${indicator.id}/numerator`,
                      search,
                    })
                  }
                >
                  Numerator
                </Button>
                <Button
                  onClick={() =>
                    navigate({
                      to: `/indicators/${indicator.id}/denominator`,
                      search,
                    })
                  }
                >
                  Denominator
                </Button>
              </Stack>
            )}
          </>
        )}
        <Stack direction="row">
          <Button
            colorScheme="red"
            onClick={() => {
              setIndicator(createIndicator());
              navigate({ to: "/indicators", search });
            }}
          >
            Cancel
          </Button>
          <Spacer />
          <Button onClick={() => add()} isLoading={loading}>
            Save Visualization Data
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Indicator;
