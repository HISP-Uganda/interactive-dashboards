import { Stack, Grid, GridItem } from "@chakra-ui/react";
import { useStore } from "effector-react";
import React from "react";
import { IDashboard, ISection, IVisualization } from "../../interfaces";
import { $report } from "../../Store";
import { setBody, setHeaderbarVisible } from "../../utils/utils";
import FixedDashboard from "../FixedDashboard";
import SectionVisualization from "../SectionVisualization";
import Visualization from "../visualizations/Visualization";
import "./normalize.min.css";
import "./dashboard-report.css";
export default function DashboardReport() {
    const report = useStore($report);
    setBody(report.size);
    setHeaderbarVisible(false);

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
                            rowsPerPage: page.items[0].metadata?.rowsPerPage,
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
                        <Grid
                            w="100%"
                            h="100%"
                            templateRows="repeat(24, 1fr)"
                            templateColumns="repeat(24, 1fr)"
                        >
                            {page.items.map((item) => {
                                if (item.type === "dashboard") {
                                    return (
                                        <GridItem
                                            w="100%"
                                            h="100%"
                                            colSpan={
                                                item.metadata?.columns || 24
                                            }
                                            rowSpan={item.metadata?.rows || 24}
                                        >
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
                                        </GridItem>
                                    );
                                } else if (item.type === "section") {
                                    return (
                                        <GridItem
                                            w="100%"
                                            h="100%"
                                            colSpan={
                                                item.metadata?.columns || 24
                                            }
                                            rowSpan={item.metadata?.rows || 24}
                                        >
                                            <Stack w="100%" height="100%">
                                                <SectionVisualization
                                                    section={{
                                                        ...(item.nodeSource as ISection),
                                                    }}
                                                />
                                            </Stack>
                                        </GridItem>
                                    );
                                } else if (item.type === "visualization") {
                                    return (
                                        <GridItem
                                            w="100%"
                                            h="100%"
                                            colSpan={
                                                item.metadata?.columns || 24
                                            }
                                            rowSpan={item.metadata?.rows || 24}
                                        >
                                            <Stack
                                                w="100%"
                                                key={item.id}
                                                h="100%"
                                            >
                                                <Visualization
                                                    visualization={
                                                        item.nodeSource as IVisualization
                                                    }
                                                    section={
                                                        item.parent as ISection
                                                    }
                                                />
                                            </Stack>
                                        </GridItem>
                                    );
                                } else {
                                    return null;
                                }
                            })}
                        </Grid>
                    </div>
                );
            })}
        </div>
    );
}
