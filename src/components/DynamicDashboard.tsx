import { Stack } from "@chakra-ui/react";
import { useStore } from "effector-react";
import React, { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { dashboardApi } from "../Events";
import { $dashboard, $size, $store, $settings } from "../Store";
import SectionVisualization from "./SectionVisualization";
import { useMatch } from "@tanstack/react-location";
import { LocationGenerics, IDashboard } from "../interfaces";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default function DynamicDashboard({
    dashboard,
}: {
    dashboard: IDashboard;
}) {
    const store = useStore($store);
    const template = useStore($settings);
    const size = useStore($size);
    const {
        params: { templateId },
    } = useMatch<LocationGenerics>();
    const settings: {
        className: string;
        rowHeight: number;
        cols: { lg: number; md: number; sm: number; xs: number };
    } = {
        className: "layout",
        rowHeight: 30,
        cols: { lg: 12, md: 10, sm: 6, xs: 4 },
    };

    const [current, setCurrent] = useState<{
        currentBreakpoint: string;
        compactType: "vertical" | "horizontal" | null | undefined;
        mounted: boolean;
        layouts: ReactGridLayout.Layouts;
    }>({
        currentBreakpoint: size,
        compactType: "vertical",
        mounted: false,
        layouts: {
            lg: dashboard.sections.map(({ lg }) => lg),
            md: dashboard.sections.map(({ md }) => md),
            sm: dashboard.sections.map(({ sm }) => sm),
            xs: dashboard.sections.map(({ xs }) => xs),
        },
    });

    function generateDOM() {
        return dashboard.sections.map((section) => (
            <Stack key={section.id} h="100%">
                <SectionVisualization section={section} />
            </Stack>
        ));
    }

    function onBreakpointChange(breakpoint: string, columns: number) {
        setCurrent((prev) => {
            return { ...prev, currentBreakpoint: breakpoint };
        });
    }

    function onLayoutChange(
        layout: ReactGridLayout.Layout[],
        layouts: ReactGridLayout.Layouts
    ) {
        const sections = dashboard.sections.map((section) => {
            let current = section;
            const xs = layouts["xs"].find(({ i }) => i === section.id);
            const sm = layouts["sm"].find(({ i }) => i === section.id);
            const md = layouts["md"].find(({ i }) => i === section.id);
            const lg = layouts["lg"].find(({ i }) => i === section.id);
            if (xs) {
                current = { ...current, xs };
            }
            if (sm) {
                current = { ...current, sm };
            }
            if (md) {
                current = { ...current, md };
            }
            if (lg) {
                current = { ...current, lg };
            }

            return current;
        });
        dashboardApi.setCurrentDashboard({ ...dashboard, sections });
    }

    const padding: [number, number] =
        (store.isAdmin && dashboard.id === template.template) || !templateId
            ? [dashboard.padding || 0, dashboard.padding || 0]
            : [0, 0];
    return (
        <Stack overflow="auto" w="100%">
            <ResponsiveReactGridLayout
                {...settings}
                margin={[dashboard.spacing, dashboard.spacing]}
                containerPadding={padding}
                layouts={current.layouts}
                onBreakpointChange={onBreakpointChange}
                onLayoutChange={onLayoutChange}
                measureBeforeMount={false}
                useCSSTransforms={current.mounted}
                compactType={current.compactType}
                preventCollision={!current.compactType}
            >
                {generateDOM()}
            </ResponsiveReactGridLayout>
        </Stack>
    );
}
