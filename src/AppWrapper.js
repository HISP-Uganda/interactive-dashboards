import { ChakraProvider } from "@chakra-ui/react";
import App from "./components/App";

const AppWrapper = () => (
    <ChakraProvider>
      <App />
    </ChakraProvider>
);

export default AppWrapper;
