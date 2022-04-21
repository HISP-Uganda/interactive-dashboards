import {
  Box,
  Button,
  Checkbox,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useStore } from "effector-react";
import { ChangeEvent } from "react";
import { useNavigate } from "@tanstack/react-location";
import { useQueryClient } from "react-query";
import { displayDataSourceType } from ".";
import {
  changeDataSource,
  changeIndicatorAttribute,
  changeNumeratorDimension,
  changeUseIndicators,
} from "../../Events";
import { $indicator } from "../../Store";
import DenominatorDialog from "../dialogs/DenominatorDialog";
import NumeratorDialog from "../dialogs/NumeratorDialog";
import NamespaceSelect from "../NamespaceSelect";

const VisualizationQueryForm = () => {
  const indicator = useStore($indicator);
  // const hasDHIS2 = useStore($hasDHIS2);
  const engine = useDataEngine();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const add = async () => {
    const mutation: any = {
      type: "create",
      resource: `dataStore/i-visualization-queries/${indicator.id}`,
      data: indicator,
    };
    await engine.mutate(mutation);
    queryClient.setQueryData(
      ["namespaces", "i-visualization-queries"],
      (old: any) => {
        if (old) {
          return [...old, indicator];
        }
        return [indicator];
      }
    );
    navigate({ to: "/visualization-queries" });
  };

  return (
    <Stack spacing="20px" p="10px">
      <Stack>
        <Text>Data Sources</Text>
        <NamespaceSelect
          value={indicator}
          namespace="i-data-sources"
          changeDataSource={changeDataSource}
        />
      </Stack>
      {/* {hasDHIS2 && (
        <Checkbox
          isChecked={indicator.useInBuildIndicators}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            changeUseIndicators(e.target.checked)
          }
        >
          Use DHIS2 Indicators
        </Checkbox>
      )} */}
      {indicator.useInBuildIndicators ? (
        <Stack>
          {displayDataSourceType({
            dataSourceType: "DHIS2",
            onChange: changeNumeratorDimension,
            denNum: indicator.numerator,
          })}
        </Stack>
      ) : (
        <>
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
            <Textarea
              value={indicator.factor}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                changeIndicatorAttribute({
                  attribute: "factor",
                  value: e.target.value,
                })
              }
            />
          </Stack>
          <Stack direction="row" spacing="50px">
            <NumeratorDialog />
            <DenominatorDialog />
          </Stack>
        </>
      )}
      <Box>
        <pre>{JSON.stringify(indicator, null, 2)}</pre>
        <Button onClick={() => add()}>Save Visualization Query</Button>
      </Box>
    </Stack>
  );
};

export default VisualizationQueryForm;
