import { Feature, Geometry } from "geojson";
import { useState, useEffect } from "react";
import { Layer } from "leaflet";
import { GeoJSON, useMap, Tooltip } from "react-leaflet";
import { generateUid } from "../../utils/uid";
import { Threshold } from "../../interfaces";
import { processMap } from "../../utils/utils";

const Layers = ({
    metadata,
    data,
    otherParams,
}: {
    metadata: any;
    data: any;
    id: string;
    otherParams: { levels: string[]; thresholds: Threshold[] };
}) => {
    const [geoJson, setGeoJson] = useState<any>(metadata.geojson);
    const [geoJsonKey, setGeoJsonKey] = useState<string>(generateUid());
    const map = useMap();

    useEffect(() => {
        const newKey = generateUid();
        setGeoJson((geoJson: any) => {
            const newGeoJson = processMap(
                geoJson,
                data,
                otherParams.thresholds
            );
            return newGeoJson.geojson;
        });
        setGeoJsonKey(() => newKey);
    }, [JSON.stringify(data)]);
    const onEachCountry = (country: Feature<Geometry, any>, layer: Layer) => {
        const name = country.properties.name;
        const confirmedText = country.properties.value;
        const tooltipChildren = `${name}: ${confirmedText}`;
        const popupContent = `<Tooltip> ${tooltipChildren} </Tooltip>`;
        layer.bindTooltip(popupContent);
    };
    return (
        <GeoJSON
            data={geoJson}
            key={geoJsonKey}
            onEachFeature={onEachCountry}
            style={(feature) => {
                const options = {
                    color: "black",
                    fillColor: feature?.properties.color || "white",
                    fillOpacity: 1,
                    weight: 1,
                };
                return options;
            }}
            eventHandlers={{
                add: (e) => {
                    map.fitBounds(e.target.getBounds());
                },
            }}
        />
    );
};

export default Layers;
