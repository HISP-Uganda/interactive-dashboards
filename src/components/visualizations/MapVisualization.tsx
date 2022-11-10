import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import Layers from "./Layers";
import { Threshold } from "../../interfaces";

export default function ({
  metadata,
  id,
  data,
  otherParams,
}: {
  metadata: any;
  id: string;
  data: any;
  otherParams: { levels: string[]; thresholds: Threshold[] };
}) {
  const position: LatLngExpression = [
    metadata.mapCenter[1],
    metadata.mapCenter[0],
  ];
  return (
    <MapContainer
      center={position}
      zoom={7}
      style={{ height: "100%", width: "100%" }}
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
