import React, { useRef, ChangeEvent } from "react";
import { Stack, StackProps } from "@chakra-ui/react";
import { $dashboard, dashboardApi } from "../Store";
import { useStore } from "effector-react";
import { generateUid } from "../utils/uid";
import { PLACE_HOLDER } from "../constants";
interface Props extends StackProps {
    alignment:
        | "bottom-left"
        | "top-left"
        | "bottom-right"
        | "top-right"
        | "middle-bottom"
        | "middle-top";
}
export default function ImageUpload({ alignment, ...rest }: Props) {
    const dashboard = useStore($dashboard);
    const currentImage =
        dashboard.images.find((image) => image.alignment === alignment)?.src ||
        PLACE_HOLDER;
    const inputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const fileObj = event.target.files && event.target.files[0];
        if (fileObj) {
            let fileReader = new FileReader();
            fileReader.onload = async (e) => {
                const result = e.target?.result;
                if (result) {
                    dashboardApi.addImage({
                        id: generateUid(),
                        alignment: alignment,
                        src: result as string,
                    });
                }
            };
            fileReader;
            fileReader.readAsDataURL(fileObj);
        }
    };
    return (
        <Stack
            onClick={() => inputRef.current?.click()}
            alignItems="center"
            justifyItems="center"
            alignContent="center"
            justifyContent="center"
            {...rest}
        >
            <img
                src={currentImage}
                alt="Image preview"
                style={{
                    objectFit: "contain",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    width: "auto",
                    height: "auto",
                }}
            />
            <input
                style={{ display: "none" }}
                ref={inputRef}
                type="file"
                onChange={handleFileChange}
            />
        </Stack>
    );
}
