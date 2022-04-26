import { useState } from "react";
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
import { ChangeEvent } from "react";
import { useQueryClient } from "react-query";
import {
  changeIndicatorAttribute,
  changeNumeratorDimension,
  changeUseIndicators,
  setIndicator,
} from "../../Events";
import { FormGenerics } from "../../interfaces";
import { $hasDHIS2, $indicator, createIndicator } from "../../Store";
import { displayDataSourceType } from "../data-sources";
import DenominatorDialog from "../dialogs/DenominatorDialog";
import NumeratorDialog from "../dialogs/NumeratorDialog";
import NamespaceSelect from "../NamespaceSelect";
const Indicator = () => {
  const search = useSearch<FormGenerics>();
  const indicator = useStore($indicator);
  const hasDHIS2 = useStore($hasDHIS2);
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
    <Box flex={1} p="20px">
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
        <Stack direction="row">
          <Button
            colorScheme="red"
            onClick={() => {
              setIndicator(createIndicator());
              navigate({ to: "/indicators" });
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
