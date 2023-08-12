import { Stack } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { useEffect } from "react";
import { useFullScreenHandle } from "react-full-screen";
import { storeApi } from "../../Events";
import { $dashboard, $dashboardType, $settings, $store } from "../../Store";
import AdminPanel from "../AdminPanel";
import DynamicDashboard from "../DynamicDashboard";
import FixedDashboard from "../FixedDashboard";

const Dashboard = () => {
    const store = useStore($store);
    const dashboard = useStore($dashboard);
    const dashboardType = useStore($dashboardType);
    const handle = useFullScreenHandle();
    const settings = useStore($settings);

    useEffect(() => {
        const callback = async (event: KeyboardEvent) => {
            if (event.key === "F5" || event.key === "f5") {
                await handle.enter();
                if (handle.active) {
                    storeApi.setIsFullScreen(true);
                } else {
                    storeApi.setShowSider(true);
                    storeApi.setIsFullScreen(true);
                }
            }
        };
        document.addEventListener("keydown", callback);
        return () => {
            document.removeEventListener("keydown", callback);
        };
    }, []);

    return (
        <Stack w="100%" h="100%" bg={dashboard.bg} spacing="0">
            {store.isAdmin &&
                settings.template &&
                settings.template === dashboard.id && <AdminPanel />}
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
