import { Stack } from "@chakra-ui/react";
import { useMatch } from "@tanstack/react-location";
import { useStore } from "effector-react";
import html2canvas from "html2canvas";
import JsPDF from "jspdf";
import { useRef, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { LocationGenerics } from "../../interfaces";
import { $dashboard, $dashboardType, $settings, $store } from "../../Store";
import AdminPanel from "../AdminPanel";
import DynamicDashboard from "../DynamicDashboard";
import FixedDashboard from "../FixedDashboard";
import { changeBackground } from "../../utils/utils";

const Dashboard = () => {
    const tbl = useRef<HTMLDivElement>(null);
    const store = useStore($store);
    const dashboard = useStore($dashboard);
    const dashboardType = useStore($dashboardType);
    const settings = useStore($settings);
    const {
        params: { templateId },
    } = useMatch<LocationGenerics>();

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
            ? dashboard.padding || 0
            : 0;

    useEffect(() => {
        changeBackground(dashboard.bg);
        return () => {
            changeBackground("unset");
        };
    }, []);

    return (
        <Stack
            w={store.isFullScreen ? "100vw" : "100%"}
            h={
                store.isFullScreen
                    ? "100vh"
                    : templateId === undefined && store.isAdmin
                    ? "calc(100vh - 48px)"
                    : `calc(100vh - 48px - ${settings.templatePadding}px - ${settings.templatePadding}px)`
            }
            bg={dashboard.bg}
            spacing="0"
            p={`${padding}px`}
            id={dashboard.id}
            ref={tbl}
            key={dashboard.id}
        >
            {templateId === undefined && store.isAdmin && <AdminPanel />}

            {dashboardType === "dynamic" ? (
                <DynamicDashboard dashboard={dashboard} />
            ) : (
                <FixedDashboard dashboard={dashboard} />
            )}
        </Stack>
    );
};

export default Dashboard;
