import { Box, Input, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";

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
    label: "Color1",
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
    label: "Rich Black FOGRA 29",
    value:
      "#001219,#005f73,#0a9396,#94d2bd,#e9d8a6,#ee9b00,#ca6702,#bb3e03,#ae2012,#9b2226",
  },
  {
    label: "Melon",
    value:
      "#fec5bb,#fcd5ce,#fae1dd,#f8edeb,#e8e8e4,#d8e2dc,#ece4db,#ffe5d9,#ffd7ba,#fec89a",
  },
  {
    label: "Xiketic",
    value:
      "#03071e,#370617,#6a040f,#9d0208,#d00000,#dc2f02,#e85d04,#f48c06,#faa307,#ffba08",
  },
  {
    label: "Pink",
    value:
      "#f72585,#b5179e,#7209b7,#560bad,#480ca8,#3a0ca3,#3f37c9,#4361ee,#4895ef,#4cc9f0",
  },
  {
    label: "Purple",
    value:
      "#7400b8,#6930c3,#5e60ce,#5390d9,#4ea8de,#48bfe3,#56cfe1,#64dfdf,#72efdd,#80ffdb",
  },
  {
    label: "Desert Sand",
    value:
      "#edc4b3,#e6b8a2,#deab90,#d69f7e,#cd9777,#c38e70,#b07d62,#9d6b53,#8a5a44,#774936",
  },
  {
    label: "Red Salsa",
    value:
      "#f94144,#f3722c,#f8961e,#f9844a,#f9c74f,#90be6d,#43aa8b,#4d908e,#577590,#277da1",
  },
  {
    label: "Yellow Green Crayola",
    value:
      "#d9ed92,#b5e48c,#99d98c,#76c893,#52b69a,#34a0a4,#168aad,#1a759f,#1e6091,#184e77",
  },
  {
    label: "Cotton Candy",
    value:
      "#ffcbf2,#f3c4fb,#ecbcfd,#e5b3fe,#e2afff,#deaaff,#d8bbff,#d0d1ff,#c8e7ff,#c0fdff",
  },
  {
    label: "Spanish Viridian",
    value:
      "#007f5f,#2b9348,#55a630,#80b918,#aacc00,#bfd200,#d4d700,#dddf00,#eeef20,#ffff3f",
  },
  {
    label: "Ruby Red",
    value:
      "#0b090a,#161a1d,#660708,#a4161a,#ba181b,#e5383b,#b1a7a6,#d3d3d3,#f5f3f4,#ffffff",
  },
  {
    label: "Midnight Green",
    value:
      "#006466,#065a60,#0b525b,#144552,#1b3a4b,#212f45,#272640,#312244,#3e1f47,#4d194d",
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
        <Stack w="100%" spacing={0}>
          <Text>{children}</Text>
          <Stack w="100%" direction="row" spacing="0">
            {props.data.value.split(",").map((c) => (
              <Box bg={c} key={c} w="100%">
                <Text>&nbsp;</Text>
              </Box>
            ))}
          </Stack>
        </Stack>
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
