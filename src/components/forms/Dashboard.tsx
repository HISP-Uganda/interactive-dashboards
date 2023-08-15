import { Stack } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { useEffect } from "react";
import { useFullScreenHandle } from "react-full-screen";
import { storeApi } from "../../Events";
import { $dashboard, $dashboardType, $settings, $store } from "../../Store";
import AdminPanel from "../AdminPanel";
import DynamicDashboard from "../DynamicDashboard";
import FixedDashboard from "../FixedDashboard";
import { useMatch } from "@tanstack/react-location";
import { LocationGenerics } from "../../interfaces";

const Dashboard = () => {
    const store = useStore($store);
    const dashboard = useStore($dashboard);
    const dashboardType = useStore($dashboardType);
    const handle = useFullScreenHandle();
    const settings = useStore($settings);

    const {
        params: { templateId },
    } = useMatch<LocationGenerics>();

    useEffect(() => {
        const callback = async (event: KeyboardEvent) => {
            if (event.key === "F5" || event.key === "f5") {
                await handle.enter();
                if (handle.active) {
                    storeApi.setIsFullScreen(true);
                } else {
                    storeApi.setIsFullScreen(true);
                }
            }
        };
        document.addEventListener("keydown", callback);
        return () => {
            document.removeEventListener("keydown", callback);
        };
    }, []);

    const padding =
        (store.isAdmin && dashboard.id === settings.template) || !templateId
            ? dashboard.spacing
            : 0;

    return (
        <Stack
            w="100%"
            h="100%"
            bg={dashboard.bg}
            spacing="0"
            p={`${padding}px`}
        >
            {((store.isAdmin && dashboard.id === settings.template) ||
                !templateId) && <AdminPanel />}

            <Stack
                h={store.isAdmin ? "calc(100vh - 96px)" : "calc(100vh - 48px)"}
                // p={`${dashboard.spacing}px`}
                spacing={0}
            >
                {dashboardType === "dynamic" ? (
                    <DynamicDashboard />
                ) : (
                    <FixedDashboard dashboard={dashboard} />
                )}
            </Stack>
        </Stack>
    );
};

export default Dashboard;
