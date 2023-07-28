import { ColorPicker, Divider } from "antd";
import { swatchColors } from "../utils/utils";

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
            onChange={(_, hex) => onChange(hex)}
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
        // <Stack position="relative">
        //     <Button
        //         onClick={onToggle}
        //         variant="outline"
        //         _hover={{ backgroundColor: "none" }}
        //         bg={color}
        //         size="sm"
        //         w="20px"
        //     >
        //         {title}
        //     </Button>

        //     {isOpen && (
        //         <Stack
        //             position="absolute"
        //             top="32px"
        //             zIndex={100}
        //             backgroundColor="white"
        //             right={0}
        //             minH="350px"
        //             minW="350px"
        //         >
        //             <Tabs>
        //                 <TabList>
        //                     <Tab>Color</Tab>
        //                     <Tab>Custom color</Tab>
        //                 </TabList>
        //                 <TabPanels>
        //                     <TabPanel p={0} m={0}>
        //                         <SwatchesPicker
        //                             colors={swatchColors}
        //                             color={color}
        //                             onChangeComplete={(color) => {
        //                                 onChange(color.hex);
        //                                 onToggle();
        //                             }}
        //                         />
        //                     </TabPanel>
        //                     <TabPanel p={0} m={0}>
        //                         <SketchPicker
        //                             color={color}
        //                             onChangeComplete={(color) => {
        //                                 onChange(color.hex);
        //                                 onToggle();
        //                             }}
        //                         />
        //                     </TabPanel>
        //                 </TabPanels>
        //             </Tabs>
        //         </Stack>
        //     )}
        // </Stack>
    );
}
