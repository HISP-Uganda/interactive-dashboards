import { Stack } from "@chakra-ui/react";
import { useStore } from "effector-react";
import React from "react";
import { IDashboard, ISection, IVisualization } from "../../interfaces";
import { $report } from "../../Store";
import { setBody, setHeaderbarVisible } from "../../utils/utils";
import FixedDashboard from "../FixedDashboard";
import SectionVisualization from "../SectionVisualization";
import Visualization from "../visualizations/Visualization";
import "./dashboard-report.css";
export default function DashboardReport() {
    setBody("A4");
    setHeaderbarVisible(false);
    const report = useStore($report);
    return (
        <div
            style={{
                position: "absolute",
                width: "100%",
            }}
        >
            {report.pages.flatMap((page) => {
                if (
                    page.items.length === 1 &&
                    page.items[0].type === "section" &&
                    page.items[0].nodeSource?.visualizations.length === 1 &&
                    (page.items[0].nodeSource?.visualizations[0].type ===
                        "tables" ||
                        page.items[0].nodeSource?.visualizations[0].properties
                            .type === "tables")
                ) {
                    const viz: IVisualization = page.items[0].nodeSource
                        ?.visualizations[0] as IVisualization;
                    const processed: IVisualization = {
                        ...viz,
                        properties: {
                            ...viz.properties,
                            display: "multiple",
                            css: "sheet padding-10mm",
                        },
                    };

                    return (
                        <Visualization
                            visualization={processed}
                            section={page.items[0].nodeSource as ISection}
                        />
                    );
                } else if (
                    page.items.length === 1 &&
                    page.items[0].type === "visualization" &&
                    page.items[0].nodeSource?.type === "tables"
                ) {
                    return <div>pages with visualization</div>;
                }
                return (
                    <div className="sheet padding-10mm" key={page.id}>
                        {page.items.map((item) => {
                            if (item.type === "dashboard") {
                                return (
                                    <Stack
                                        p={`${item.nodeSource?.spacing}px`}
                                        key={item.id}
                                        w="100%"
                                        h="100%"
                                    >
                                        <FixedDashboard
                                            dashboard={
                                                item.nodeSource as IDashboard
                                            }
                                        />
                                    </Stack>
                                );
                            } else if (item.type === "section") {
                                return (
                                    <Stack w="100%" key={item.id} h="100%">
                                        <SectionVisualization
                                            section={{
                                                ...(item.nodeSource as ISection),
                                            }}
                                        />
                                    </Stack>
                                );
                            } else if (item.type === "visualization") {
                                return (
                                    <Stack w="100%" key={item.id} h="100%">
                                        <Visualization
                                            visualization={
                                                item.nodeSource as IVisualization
                                            }
                                            section={item.parent as ISection}
                                        />
                                    </Stack>
                                );
                            } else {
                                return null;
                            }
                        })}
                    </div>
                );
            })}
        </div>
    );
}
