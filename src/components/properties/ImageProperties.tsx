import React, { ChangeEvent, useRef } from "react";
import { IVisualization } from "../../interfaces";
import { Stack, Text, Input, Button } from "@chakra-ui/react";
import { changeVisualizationProperties } from "../../Events";

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
                    changeVisualizationProperties({
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
                        changeVisualizationProperties({
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
        </Stack>
    );
}
