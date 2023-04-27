import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import { Threshold } from "../../interfaces";
import Layers from "./Layers";

export default function ({
    metadata,
    id,
    data,
    otherParams,
    height,
    width,
}: {
    metadata: any;
    id: string;
    data: any;
    otherParams: { levels: string[]; thresholds: Threshold[] };
    height?: number;
    width?: number;
}) {
    const position: LatLngExpression = [
        metadata.mapCenter[1],
        metadata.mapCenter[0],
    ];

    return (
        <MapContainer
            center={position}
            zoom={7}
            style={{
                height: "100%",
                width: "100%",
            }}
            id={id}
            key={id}
        >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Layers
                metadata={metadata}
                data={data}
                id={id}
                otherParams={otherParams}
            />
        </MapContainer>
    );
}
