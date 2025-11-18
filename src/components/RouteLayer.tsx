import { LineLayer, ShapeSource } from '@maplibre/maplibre-react-native';
import type { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

interface RouteLayerProps {
  routeGeoJson: FeatureCollection<Geometry, GeoJsonProperties>;
}

export default function RouteLayer({ routeGeoJson }: RouteLayerProps) {
  return (
    <ShapeSource id='route' shape={routeGeoJson}>
      <LineLayer
        id='route-line'
        style={{ lineColor: '#007AFF', lineWidth: 4 }}
      />
    </ShapeSource>
  );
}
