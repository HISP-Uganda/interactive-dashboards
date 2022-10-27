import { Feature, Geometry } from "geojson";
import { Layer } from "leaflet";
import { GeoJSON, useMap } from "react-leaflet";

const Layers = ({ metadata }: { metadata: any }) => {
  const map = useMap();
  const onEachCountry = (country: Feature<Geometry, any>, layer: Layer) => {
    layer.on("mouseover", (e) => {
      const name = country.properties.name;
      const confirmedText = country.properties.value;
      e.target.bindPopup(`${name}: ${confirmedText}`).openPopup();
    });
    layer.on("mouseout", (e) => {
      e.target.setStyle({ fillOpacity: 1 });
      e.target.unbindPopup().closePopup();
    });
  };
  return (
    <GeoJSON
      data={metadata.geojson}
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
