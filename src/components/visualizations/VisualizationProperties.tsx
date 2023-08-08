import { IVisualization } from "../../interfaces";
import BarGraphProperties from "../properties/BarGraphProperties";
import CategoryListProperties from "../properties/CategoryListProperties";
import ClockProperties from "../properties/ClockProperties";
import DHIS2VisualizationProperties from "../properties/DHIS2VisualizationProperties";
import FiltersProperties from "../properties/FiltersProperties";
import GaugeChartProperties from "../properties/GaugeChartProperties";
import HeatMapProperties from "../properties/HeatMapProperties";
import HistogramProperties from "../properties/HistogramProperties";
import ImageProperties from "../properties/ImageProperties";
import LineGraphProperties from "../properties/LineGraphProperties";
import MapChartProperties from "../properties/MapChartProperties";
import OptionSetProperties from "../properties/OptionSetProperties";
import PieChartProperties from "../properties/PieChartProperties";
import RadarGraphProperties from "../properties/RadarGraphProperties";
import ScatterProperties from "../properties/ScatterProperties";
import SingleValueProperties from "../properties/SingleValueProperties";
import StackedAreaChartProperties from "../properties/StackedAreaChartProperties";
import SunburstGraphProperties from "../properties/SunBurstChartProperties";
import TableProperties from "../properties/TableProperties";
import TextVisualisationProperties from "../properties/TextVisualisationproperties";
import DashboardTitleProperties from "../properties/DashboardTitleProperties";
type VizProps = {
    visualization: IVisualization;
};

const VisualizationProperties = ({ visualization }: VizProps) => {
    const displayProperties = (visualizationType: string | undefined) => {
        const allTypes: any = {
            single: <SingleValueProperties visualization={visualization} />,
            bar: <BarGraphProperties visualization={visualization} />,
            line: <LineGraphProperties visualization={visualization} />,
            pie: <PieChartProperties visualization={visualization} />,
            map: <MapChartProperties visualization={visualization} />,
            histogram: <HistogramProperties visualization={visualization} />,
            scatterplot: <ScatterProperties visualization={visualization} />,
            sunburst: <SunburstGraphProperties visualization={visualization} />,
            gauge: <GaugeChartProperties visualization={visualization} />,
            radar: <RadarGraphProperties visualization={visualization} />,
            stackedarea: (
                <StackedAreaChartProperties visualization={visualization} />
            ),
            imageVisualization: (
                <ImageProperties visualization={visualization} />
            ),
            filters: <FiltersProperties visualization={visualization} />,
            tables: <TableProperties visualization={visualization} />,
            optionSet: <OptionSetProperties visualization={visualization} />,
            text: <TextVisualisationProperties visualization={visualization} />,
            clock: <ClockProperties />,
            heatmap: <HeatMapProperties />,
            categoryList: (
                <CategoryListProperties visualization={visualization} />
            ),
            dhis2: (
                <DHIS2VisualizationProperties visualization={visualization} />
            ),
            dashboardTitle: (
                <DashboardTitleProperties visualization={visualization} />
            ),
        };
        if (visualizationType) {
            return allTypes[visualizationType] || null;
        }
        return null;
    };
    return displayProperties(visualization.type);
};

export default VisualizationProperties;
