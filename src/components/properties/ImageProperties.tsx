import { Button, Input, Stack, Text } from "@chakra-ui/react";
import React, { ChangeEvent, useRef } from "react";
import { sectionApi } from "../../Events";
import { IVisualization } from "../../interfaces";
import NumberProperty from "./NumberProperty";

export default function ImageProperties({
    visualization,
}: {
    visualization: IVisualization;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const fileObj = event.target.files && event.target.files[0];
        if (fileObj) {
            let fileReader = new FileReader();
            fileReader.onload = async (e) => {
                const result = e.target?.result;
                if (result) {
                    sectionApi.changeVisualizationProperties({
                        visualization: visualization.id,
                        attribute: "data.src",
                        value: result,
                    });
                }
            };
            fileReader;
            fileReader.readAsDataURL(fileObj);
        }
    };
    return (
        <Stack>
            <Stack direction="row" alignItems="center">
                <Text>URL</Text>
                <Input
                    flex={1}
                    value={visualization.properties["data.src"]}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        sectionApi.changeVisualizationProperties({
                            visualization: visualization.id,
                            attribute: "data.src",
                            value: e.target.value,
                        })
                    }
                />
                <Button onClick={() => inputRef.current?.click()}>
                    Upload
                </Button>
            </Stack>

            <input
                style={{ display: "none" }}
                ref={inputRef}
                type="file"
                onChange={handleFileChange}
            />

            <NumberProperty
                title="Image Size"
                min={1}
                max={500}
                step={5}
                visualization={visualization}
                attribute="boxSize"
            />
            <NumberProperty
                title="Width"
                min={1}
                max={500}
                step={5}
                visualization={visualization}
                attribute="data.width"
            />
            <NumberProperty
                title="Height"
                min={1}
                max={500}
                step={5}
                visualization={visualization}
                attribute="data.height"
            />
        </Stack>
    );
}
