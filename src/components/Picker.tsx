import { ColorPicker, Divider } from "antd";
import { swatchColors } from "../utils/utils";
import { Color } from "antd/es/color-picker";

export default function Picker({
    color,
    onChange,
    title,
}: {
    color: string;
    onChange: (color: string) => void;
    title?: string;
}) {
    return (
        <ColorPicker
            allowClear
            value={color}
            onChange={(value: Color, hex: string) => onChange(hex)}
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
}
