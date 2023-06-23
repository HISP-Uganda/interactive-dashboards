import { IVisualization } from "../../interfaces";
import BarGraphProperties from "../properties/BarGraphProperties";
import ImageProperties from "../properties/ImageProperties";
import LineGraphProperties from "../properties/LineGraphProperties";
import MapChartProperties from "../properties/MapChartProperties";
import PieChartProperties from "../properties/PieChartProperties";
import SingleValueProperties from "../properties/SingleValueProperties";
import FiltersProperties from "../properties/FiltersProperties";
import HistogramProperties from "../properties/HistogramProperties";
import ScatterProperties from "../properties/ScatterProperties";
import SunburstGraphProperties from "../properties/SunBurstChartProperties";
import GaugeChartProperties from "../properties/GaugeChartProperties";
import RadarGraphProperties from "../properties/RadarGraphProperties";
import StackedAreaChartProperties from "../properties/StackedAreaChartProperties";
import TableProperties from "../properties/TableProperties";
import OptionSetProperties from "../properties/OptionSetProperties";
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
        };
        if (visualizationType) {
            return allTypes[visualizationType] || null;
        }
        return null;
    };
    return displayProperties(visualization.type);
};

export default VisualizationProperties;
