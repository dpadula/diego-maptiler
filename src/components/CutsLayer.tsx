import {
  FillLayer,
  LineLayer,
  ShapeSource,
} from '@maplibre/maplibre-react-native';

import type { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

type CutsLayerProps = {
  geojson: FeatureCollection<Geometry, GeoJsonProperties>;
};
export default function CutsLayer({ geojson }: CutsLayerProps) {
  return (
    <ShapeSource id='cuts' shape={geojson}>
      <LineLayer id='cuts-line' style={{ lineColor: 'red', lineWidth: 4 }} />
      <FillLayer id='cuts-fill' style={{ fillColor: 'rgba(255,0,0,0.3)' }} />
    </ShapeSource>
  );
}
