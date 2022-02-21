import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

import App from "./components/App";
const queryClient = new QueryClient();

const AppWrapper = () => (
  <ChakraProvider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </ChakraProvider>
);

export default AppWrapper;
