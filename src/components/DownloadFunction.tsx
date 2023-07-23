import React from "react";
import { Icon, Button, useToast } from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

type DownloadFunctionProps = {
    onClick: () => void;
};

const DownloadFunction: React.FC<DownloadFunctionProps> = ({ onClick }) => {
    const toast = useToast();

    const handleDownload = () => {
        const sectionContainer = document.getElementById("section-container");

        if (sectionContainer) {
            html2canvas(sectionContainer).then((canvas) => {
                try {
                    canvas.toBlob((blob) => {
                        if (blob) {
                            saveAs(blob, "section.png");
                            toast({
                                title: "Section downloaded!",
                                description: "The section has been downloaded as a PNG.",
                                status: "success",
                                duration: 3000,
                                isClosable: true,
                            });
                        }
                    });
                } catch (error) {
                    console.error("Error saving image:", error);
                    toast({
                        title: "Error",
                        description: "An error occurred while saving the section.",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                }
            });
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => {
                onClick();
                handleDownload();
            }}
            leftIcon={<Icon as={DownloadIcon} />}
        >
            Download
        </Button>
    );
};

export default DownloadFunction;
