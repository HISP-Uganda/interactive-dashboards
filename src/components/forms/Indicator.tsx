import React from "react";
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
import { useStore } from "effector-react";
import { ChangeEvent } from "react";
import { useNavigate } from "@tanstack/react-location";
import { useQueryClient } from "react-query";
import {
  changeDataSource,
  changeIndicatorAttribute,
  changeNumeratorDimension,
  changeUseIndicators,
} from "../../Events";
import { $indicator, $hasDHIS2 } from "../../Store";
import DenominatorDialog from "../dialogs/DenominatorDialog";
import NumeratorDialog from "../dialogs/NumeratorDialog";
import NamespaceSelect from "../NamespaceSelect";
import { displayDataSourceType } from "../data-sources";
const Indicator = () => {
  const indicator = useStore($indicator);
  const hasDHIS2 = useStore($hasDHIS2);
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
    navigate({ to: "/indicators" });
  };

  return (
    <Stack flex={1}>
      <Stack w="50%" p="20px" spacing="20px">
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
          <Box textAlign="right">
            <Button onClick={() => add()}>Save Indicator</Button>
          </Box>
      </Stack>
    </Stack>
  );
};

export default Indicator;
