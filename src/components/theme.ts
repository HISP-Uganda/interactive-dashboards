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
    Table: {
      parts: ["th", "td"],
      baseStyle: {
        th: {
          borderColor: "gray.300",
        },
        td: {
          borderColor: "gray.300",
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: "yellow.300",
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
