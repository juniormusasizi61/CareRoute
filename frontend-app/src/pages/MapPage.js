import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const MapPage = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    // Skip map boot if token is not configured in environment.
    if (!MAPBOX_TOKEN) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-122.4376, 37.7577],
      zoom: 11,
    });

    new mapboxgl.Marker().setLngLat([-122.4376, 37.7577]).addTo(map);

    // Clean up map instance to prevent memory leaks on route changes.
    return () => map.remove();
  }, []);

  return (
    <div>
      <h2>Route Map</h2>
      <div ref={mapContainer} style={{ width: '100%', height: '75vh' }} />
    </div>
  );
};

export default MapPage;
