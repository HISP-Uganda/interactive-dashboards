import {
  Box,
  Icon,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";

import {
  chakraComponents,
  GroupBase,
  OptionProps,
  Select,
} from "chakra-react-select";
import { useStore } from "effector-react";
import { isArray } from "lodash";
import { ChangeEvent } from "react";
import { changeVisualizationProperties } from "../../Events";
import { IVisualization, Option } from "../../interfaces";
import { $visualizationData } from "../../Store";
import { createOptions } from "./AvialableOptions";

const barModes = createOptions(["stack", "group", "overlay", "relative"]);
const orientations = createOptions(["stack", "group", "overlay", "relative"]);

const colors: Option[] = [
  {
    label: "",
    value: [
      "#1f77b4",
      "#ff7f0e",
      "#2ca02c",
      "#d62728",
      "#9467bd",
      "#8c564b",
      "#e377c2",
      "#7f7f7f",
      "#bcbd22",
    ].join(","),
  },
  {
    label: "",
    value:
      "#303638,#f0c808,#5d4b20,#469374,#9341b3,#e3427d,#e68653,#ebe0b0,#edfbba",
  },
  {
    label: "",
    value:
      "#6a00ff,#ff00ff,#ff0040,#ff9500,#ffff00,#aaff00,#00ff15,#00ffff,#0095ff",
  },
];

const BarGraphProperties = ({
  visualization,
}: {
  visualization: IVisualization;
}) => {
  const visualizationData = useStore($visualizationData);
  const columns = visualizationData[visualization.id]
    ? Object.keys(visualizationData[visualization.id][0]).map<Option>((o) => {
        return { value: o, label: o };
      })
    : [];

  const customComponents = {
    Option: ({
      children,
      ...props
    }: OptionProps<Option, false, GroupBase<Option>>) => (
      <chakraComponents.Option {...props}>
        {children}
        {props.data.value.split(",").map((c) => (
          <Icon />
        ))}
      </chakraComponents.Option>
    ),
  };

  return (
    <Stack>
      <Text>Category</Text>
      <Select<Option, false, GroupBase<Option>>
        value={columns.find(
          (pt) => pt.value === visualization.properties["category"]
        )}
        onChange={(e) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "category",
            value: e?.value,
          })
        }
        options={columns}
        isClearable
      />
      <Text>Traces</Text>
      <Select<Option, false, GroupBase<Option>>
        value={columns.find(
          (pt) => pt.value === visualization.properties["series"]
        )}
        onChange={(e) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "series",
            value: e?.value,
          })
        }
        options={columns}
        isClearable
      />
      <Text>Bar Mode</Text>
      <Select<Option, false, GroupBase<Option>>
        value={barModes.find(
          (pt) => pt.value === visualization.properties["layout.barmode"]
        )}
        onChange={(e) =>
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "layout.barmode",
            value: e?.value,
          })
        }
        options={barModes}
        isClearable
      />
      <Stack>
        <Text>Orientation</Text>

        <RadioGroup
          onChange={(e: string) =>
            changeVisualizationProperties({
              visualization: visualization.id,
              attribute: "data.orientation",
              value: e,
            })
          }
          value={visualization.properties["data.orientation"]}
        >
          <Stack direction="row">
            <Radio value="h">Horizontal</Radio>
            <Radio value="v">Vertical</Radio>
          </Stack>
        </RadioGroup>
      </Stack>

      {/* <ColorPalette
        value={[
          "#303638",
          "#f0c808",
          "#5d4b20",
          "#469374",
          "#9341b3",
          "#e3427d",
          "#e68653",
          "#ebe0b0",
          "#edfbba",
        ]}
      /> */}

      {/* <CSelect placeholder="Select option">
        {colors.map((color) => (
          <option value="option3" key={String(color)}>
            {color.map((c) => (
              <Box bg={c} key={c} height="35px">
                <Text>&nbsp;</Text>
              </Box>
            ))}
          </option>
        ))}
      </CSelect> */}

      <Select<Option, false, GroupBase<Option>>
        value={colors.find((pt) => {
          if (
            visualization.properties["layout.colorway"] &&
            isArray(visualization.properties["layout.colorway"])
          ) {
            return (
              visualization.properties["layout.colorway"].join(",") === pt.value
            );
          }
          return false;
        })}
        onChange={(e) => {
          const val = e?.value || "";
          changeVisualizationProperties({
            visualization: visualization.id,
            attribute: "layout.colorway",
            value: val.split(","),
          });
        }}
        options={colors}
        isClearable
        components={customComponents}
      />

      <Text>Legend</Text>

      <Stack>
        <Text>X-Anchor</Text>
        <RadioGroup
          onChange={(e: string) =>
            changeVisualizationProperties({
              visualization: visualization.id,
              attribute: "layout.legend.xanchor",
              value: e,
            })
          }
          value={visualization.properties["layout.legend.xanchor"]}
        >
          <Stack direction="row">
            <Radio value="auto">Auto</Radio>
            <Radio value="right">Left</Radio>
            <Radio value="left">Right</Radio>
            <Radio value="center">Center</Radio>
          </Stack>
        </RadioGroup>
      </Stack>

      <Stack>
        <Text>Y-Anchor</Text>
        <RadioGroup
          onChange={(e: string) =>
            changeVisualizationProperties({
              visualization: visualization.id,
              attribute: "layout.legend.yanchor",
              value: e,
            })
          }
          value={visualization.properties["layout.legend.yanchor"]}
        >
          <Stack direction="row">
            <Radio value="auto">Auto</Radio>
            <Radio value="top">Top</Radio>
            <Radio value="bottom">Bottom</Radio>
            <Radio value="middle">Middle</Radio>
          </Stack>
        </RadioGroup>
      </Stack>

      <Stack>
        <Text>Y-Axis Title</Text>
        <Input
          value={visualization.properties["layout.yaxis.title"]}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            changeVisualizationProperties({
              visualization: visualization.id,
              attribute: "layout.yaxis.title",
              value: e.target.value,
            })
          }
        />
      </Stack>
    </Stack>
  );
};

export default BarGraphProperties;
