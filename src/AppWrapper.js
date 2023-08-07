import "@fontsource/raleway";
import "@fontsource/open-sans";

import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./components/App";
import ReactErrorBoundary from "./components/ReactErrorBoundary";
import theme from "./components/theme";
import "./index.css";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
            networkMode: "offlineFirst",
        },
    },
});

const AppWrapper = () => (
    <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
            <ReactErrorBoundary>
                <App />
            </ReactErrorBoundary>
        </QueryClientProvider>
    </ChakraProvider>
);

export default AppWrapper;
