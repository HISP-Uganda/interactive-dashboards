import { ColorPicker, Divider } from "antd";
import React from "react";
import { IVisualization } from "../interfaces";
import { swatchColors } from "../utils/utils";
import { sectionApi } from "../Events";

type ColorPalletProps = {
    visualization: IVisualization;
    attribute: string;
};

const ColorPalette = ({ visualization, attribute }: ColorPalletProps) => {
    return (
        <ColorPicker
            allowClear
            value={visualization.properties[attribute]}
            onChange={(_, hex) =>
                sectionApi.changeVisualizationProperties({
                    visualization: visualization.id,
                    attribute: attribute,
                    value: hex,
                })
            }
            styles={{
                popupOverlayInner: {
                    width: 468 + 24,
                },
            }}
            presets={[
                {
                    label: "Recommended",
                    colors: swatchColors.flat(),
                },
            ]}
            panelRender={(_, { components: { Picker, Presets } }) => (
                <div
                    className="custom-panel"
                    style={{
                        display: "flex",
                        width: 468,
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            height: 300,
                            overflow: "auto",
                        }}
                    >
                        <Presets />
                    </div>
                    <Divider
                        type="vertical"
                        style={{
                            height: "auto",
                        }}
                    />
                    <div
                        style={{
                            width: 234,
                        }}
                    >
                        <Picker />
                    </div>
                </div>
            )}
        />
    );
};

export default ColorPalette;
