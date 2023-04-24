import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    components: {
        Button: {
            baseStyle: {
                _focus: {
                    boxShadow: "none",
                },
            },
        },
    },
    styles: {
        global: {
            body: {
                // bg: "gray.50",
                // boxSizing: "border-box",
                // position: "relative",
                p: "0",
                m: "0",
            },
        },
    },
    fonts: {
        heading: `'Open Sans', sans-serif`,
        body: `'Raleway', sans-serif`,
    },
});

export default theme;
