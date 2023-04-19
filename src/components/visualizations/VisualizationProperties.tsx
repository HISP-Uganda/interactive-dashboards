import { IVisualization } from "../../interfaces";
import BarGraphProperties from "../properties/BarGraphProperties";
import ImageProperties from "../properties/ImageProperties";
import LineGraphProperties from "../properties/LineGraphProperties";
import MapChartProperties from "../properties/MapChartProperties";
import PieChartProperties from "../properties/PieChartProperties";
import SingleValueProperties from "../properties/SingleValueProperties";
import FiltersProperties from "../properties/FiltersProperties";

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
            imageVisualization: (
                <ImageProperties visualization={visualization} />
            ),
            filters: <FiltersProperties visualization={visualization} />,
        };
        if (visualizationType) {
            return allTypes[visualizationType] || null;
        }
        return null;
    };
    return displayProperties(visualization.type);
};

export default VisualizationProperties;
