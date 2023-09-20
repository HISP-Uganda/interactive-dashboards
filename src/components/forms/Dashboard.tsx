import { Stack, Text } from "@chakra-ui/react";
import { useMatch, useSearch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import html2canvas from "html2canvas";
import JsPDF from "jspdf";
import { LocationGenerics } from "../../interfaces";
import { $dashboard, $dashboardType, $settings, $store } from "../../Store";
import AdminPanel from "../AdminPanel";
import DynamicDashboard from "../DynamicDashboard";
import FixedDashboard from "../FixedDashboard";
import DashboardReport from "../DashboardReport";

const Dashboard = () => {
    const tbl = useRef<HTMLDivElement>(null);
    const store = useStore($store);
    const dashboard = useStore($dashboard);
    const dashboardType = useStore($dashboardType);
    const settings = useStore($settings);
    const {
        params: { templateId },
    } = useMatch<LocationGenerics>();

    const { display } = useSearch<LocationGenerics>();

    useHotkeys("ctrl+p", async () => {
        if (tbl.current) {
            html2canvas(tbl.current).then((canvas) => {
                canvas.style.width = `${canvas.width}px`;
                canvas.style.height = `${canvas.height}px`;
                const imageData: any = canvas.toDataURL("img/png");
                const report = new JsPDF("l", "px", [
                    canvas.width + 20,
                    canvas.height + 20,
                ]);
                report.addImage(
                    imageData,
                    "PNG",
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                report.save("download.pdf");
            });
        }
    });
    const padding =
        (store.isAdmin && dashboard.id === settings.template) || !templateId
            ? dashboard.spacing
            : 0;

    if (display === "report") {
        return <DashboardReport dashboard={dashboard} />;
    }
    return (
        <Stack
            w={store.isFullScreen ? "100vw" : "100%"}
            h={store.isFullScreen ? "100vh" : "100%"}
            bg={dashboard.bg}
            spacing="0"
            p={`${padding}px`}
            id={dashboard.id}
            ref={tbl}
            key={dashboard.id}
        >
            {((store.isAdmin && dashboard.id === settings.template) ||
                !templateId) && <AdminPanel />}

            {dashboardType === "dynamic" ? (
                <DynamicDashboard />
            ) : (
                <FixedDashboard dashboard={dashboard} />
            )}
        </Stack>
    );
};

export default Dashboard;
