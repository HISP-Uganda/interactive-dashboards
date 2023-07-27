import React from "react";
import { sectionApi } from "../Events";
import { ISection } from "../interfaces";
import Picker from "./Picker";

type ColorPalletProps = {
    section: ISection;
};

const SectionColorPalette = ({ section }: ColorPalletProps) => {
    return (
        <Picker
            title=""
            color={section.bg}
            onChange={(color) => {
                sectionApi.changeSectionAttribute({
                    attribute: "bg",
                    value: color,
                });
            }}
        />
    );
};

export default SectionColorPalette;
