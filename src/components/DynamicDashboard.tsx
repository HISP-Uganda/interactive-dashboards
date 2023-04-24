import { Stack } from "@chakra-ui/react";
import { useStore } from "effector-react";
import React, { useState, MouseEvent } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { setCurrentDashboard, setCurrentSection } from "../Events";
import { $dashboard, $size, isOpenApi, $store } from "../Store";
import SectionVisualization from "./SectionVisualization";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default function DynamicDashboard() {
    const dashboard = useStore($dashboard);
    const store = useStore($store);
    const size = useStore($size);
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
            <Stack
                key={section.id}
                h="100%"
                onClick={(e: MouseEvent<HTMLElement>) => {
                    if (e.detail === 2 && store.isAdmin) {
                        setCurrentSection(section);
                        isOpenApi.onOpen();
                    }
                }}
            >
                <SectionVisualization {...section} />
            </Stack>
        ));
    }

    function onBreakpointChange(breakpoint: string, columns: number) {
        setCurrent((prev) => {
            return { ...prev, currentBreakpoint: breakpoint };
        });
    }

    function onCompactTypeChange() {
        const { compactType: oldCompactType } = current;
        const compactType =
            oldCompactType === "horizontal"
                ? "vertical"
                : oldCompactType === "vertical"
                ? null
                : "horizontal";
        setCurrent((prev) => {
            return { ...prev, compactType };
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
        setCurrentDashboard({ ...dashboard, sections });
    }
    return (
        <Stack>
            <ResponsiveReactGridLayout
                {...settings}
                margin={[2, 2]}
                layouts={current.layouts}
                onBreakpointChange={onBreakpointChange}
                onLayoutChange={onLayoutChange}
                // WidthProvider option
                measureBeforeMount={false}
                // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
                // and set `measureBeforeMount={true}`.
                useCSSTransforms={current.mounted}
                compactType={current.compactType}
                preventCollision={!current.compactType}
            >
                {generateDOM()}
            </ResponsiveReactGridLayout>
        </Stack>
    );
}
