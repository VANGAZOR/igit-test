import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Draw } from 'ol/interaction';
import { LineString } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import useMapStore from '../../store/mapStore';
import Button from '../../components/Button/Button';

const MapComponent: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const drawInteractionRef = useRef<Draw | null>(null);
  const vectorSourceRef = useRef<VectorSource | null>(null);
  const { lineLength, setLineLength } = useMapStore();

  useEffect(() => {
    const vectorSource = new VectorSource();
    vectorSourceRef.current = vectorSource;
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    if (ref.current && !mapRef.current) {
      mapRef.current = new Map({
        layers: [new TileLayer({ source: new OSM() }), vectorLayer],
        view: new View({ center: [0, 0], zoom: 2 }),
        target: ref.current,
      });
    }

    const draw = new Draw({
      source: vectorSource,
      type: 'LineString',
      maxPoints: 2,
    });

    draw.on('drawstart', () => {
      vectorSource.clear();
    });

    draw.on('drawend', (event) => {
      const line: LineString = event.feature.getGeometry() as LineString;
      const length = line.getLength();
      setLineLength(length / 1000);
      mapRef.current?.removeInteraction(drawInteractionRef.current!);
    });

    drawInteractionRef.current = draw;

    return () => {
      if (mapRef.current) {
        mapRef.current.dispose();
        mapRef.current = null;
      }
    };
  }, []);

  const startDrawing = () => {
    if (drawInteractionRef.current && mapRef.current) {
      setLineLength(null);
      mapRef.current.addInteraction(drawInteractionRef.current);
    }
  };

  return (
    <div className=' mx-10 mt-10'>
      <div ref={ref} className='w-full  h-96'></div>
      <Button onClick={startDrawing} />
      {lineLength !== null && <p className=' mt-9'>Длина линии: {lineLength.toFixed(2)} км.</p>}
    </div>
  );
};

export default MapComponent;
