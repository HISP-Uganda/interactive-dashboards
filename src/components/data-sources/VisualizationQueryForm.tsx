import { Box, Button, Input, Stack, Text, Textarea } from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useQueryClient } from "react-query";
import { useStore } from "effector-react";
import { useNavigate } from "react-location";
import { ChangeEvent } from "react";
import { changeIndicatorAttribute } from "../../Events";
import { IIndicator } from "../../interfaces";
import { $indicator } from "../../Store";
import DenominatorDialog from "../dialogs/DenominatorDialog";
import NumeratorDialog from "../dialogs/NumeratorDialog";

const VisualizationQueryForm = () => {
  const indicator = useStore($indicator);
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
      <Box>
        <Button onClick={() => add()}>Save Visualization Query</Button>
      </Box>
    </Stack>
  );
};

export default VisualizationQueryForm;
