import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "gray.300",
      },
    },
  },
  fonts: {
    // heading: `'Montserrat', sans-serif`,
    // body: "'Montserrat'",
  },
});

export default theme;
