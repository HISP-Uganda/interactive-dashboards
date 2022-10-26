import {
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { GroupBase, Select } from "chakra-react-select";
import { ChangeEvent } from "react";
import {
  changeVisualizationAttribute,
  changeVisualizationProperties,
} from "../../Events";
import { IVisualization, Option } from "../../interfaces";
import ColorPalette from "../ColorPalette";
import ColorRangePicker from "../ColorRangePicker";

const progressAlignments: Option[] = [
  {
    label: "Column",
    value: "column",
  },
  {
    label: "Column Reverse",
    value: "column-reverse",
  },
  {
    label: "Row",
    value: "row",
  },
  {
    label: "Row Reverse",
    value: "row-reverse",
  },
];

const SingleValueProperties = ({
  visualization,
}: {
  visualization: IVisualization;
}) => {
  return (
    <Stack>
      <Text>Label Alignment</Text>
      <Select<Option, false, GroupBase<Option>>
        value={progressAlignments.find(
          (pt) => pt.value === visualization.properties?.["data.alignment"]
        )}
        onChange={(e) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "data.alignment",
            value: e?.value,
          })
        }
        options={progressAlignments}
        isClearable
      />
      <Text>Prefix</Text>
      <Input
        value={visualization.properties?.["data.prefix"] || ""}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "data.prefix",
            value: e.target.value,
          })
        }
      />
      <Text>Suffix</Text>
      <Input
        value={visualization.properties?.["data.suffix"] || ""}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "data.suffix",
            value: e.target.value,
          })
        }
      />
      <Text>Number format style</Text>
      <RadioGroup
        onChange={(e: string) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "data.format.style",
            value: e,
          })
        }
        value={visualization.properties["data.format.style"] || "decimal"}
      >
        <Stack direction="row">
          <Radio value="decimal">Decimal</Radio>
          <Radio value="percent">Percent</Radio>
          <Radio value="currency">Currency</Radio>
        </Stack>
      </RadioGroup>

      <Text>Number format notation</Text>
      <RadioGroup
        onChange={(e: string) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "data.format.notation",
            value: e,
          })
        }
        value={visualization.properties["data.format.notation"] || "standard"}
      >
        <Stack direction="row">
          <Radio value="standard">Standard</Radio>
          <Radio value="compact">Compact</Radio>
        </Stack>
      </RadioGroup>
      <Text>Single Value Background Color</Text>
      <ColorPalette
        visualization={visualization}
        attribute="data.backgroundColor"
      />
      <Text>Single Value Border and Border Radius</Text>
      <NumberInput
        value={visualization.properties["data.border"] || 0}
        max={2}
        min={0}
        step={1}
        onChange={(value1: string, value2: number) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "data.border",
            value: value2,
          })
        }
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Text>Number format decimal places</Text>
      <NumberInput
        value={
          visualization.properties["data.format.maximumFractionDigits"] || 0
        }
        max={4}
        min={0}
        onChange={(value1: string, value2: number) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "data.format.maximumFractionDigits",
            value: value2,
          })
        }
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>

      <Text>Value Font Size</Text>
      <NumberInput
        value={visualization.properties["data.format.fontSize"] || 2}
        max={10}
        min={1}
        step={0.1}
        onChange={(value1: string, value2: number) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "data.format.fontSize",
            value: value2,
          })
        }
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>

      <Text>Value Font Weight</Text>
      <NumberInput
        value={visualization.properties["data.format.fontWeight"] || 400}
        max={1000}
        min={100}
        step={50}
        onChange={(value1: string, value2: number) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "data.format.fontWeight",
            value: value2,
          })
        }
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>

      <Text>Label Value Spacing</Text>
      <NumberInput
        value={visualization.properties["data.format.spacing"] || 0}
        max={100}
        min={0}
        step={1}
        onChange={(value1: string, value2: number) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "data.format.spacing",
            value: value2,
          })
        }
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <ColorRangePicker visualization={visualization} />
      <Text>Target</Text>
      <Input
        value={visualization.properties?.["data.target"] || ""}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "data.target",
            value: e.target.value,
          })
        }
      />
      <Text>Target Graph</Text>
      <RadioGroup
        onChange={(e: string) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "data.targetgraph",
            value: e,
          })
        }
        value={visualization.properties?.["data.targetgraph"]}
      >
        <Stack direction="row">
          <Radio value="progress">Progress</Radio>
          <Radio value="circular">Circular Progress</Radio>
        </Stack>
      </RadioGroup>

      <Text>Target Direction</Text>
      <Select<Option, false, GroupBase<Option>>
        value={progressAlignments.find(
          (pt) => pt.value === visualization.properties?.["data.direction"]
        )}
        onChange={(e) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "data.direction",
            value: e?.value,
          })
        }
        options={progressAlignments}
        isClearable
      />

      <Text>Grouping</Text>
      <Input
        value={visualization.group}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          changeVisualizationAttribute({
            visualization: visualization.id,
            attribute: "group",
            value: e.target.value,
          })
        }
      />
    </Stack>
  );
};

export default SingleValueProperties;
