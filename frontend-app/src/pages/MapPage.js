import React, { useRef, useEffect, useState, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import AuthContext from '../contexts/AuthContext';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
// Keep a stable flag so the UI can explain why the map is unavailable.
const hasMapboxToken = Boolean(MAPBOX_TOKEN);

const MapPage = () => {
  const mapContainer = useRef(null);
  const { user, fetchClients } = useContext(AuthContext);
  const [clients, setClients] = useState([]);
  // Store API errors so the map summary can explain failed client loading.
  const [error, setError] = useState(null);
  // Track whether the saved client list is still being fetched.
  const [loading, setLoading] = useState(true);

  // Load user clients for the map summary panel.
  useEffect(() => {
    if (!user) return;

    const loadClients = async () => {
      setLoading(true);
      try {
        const savedClients = await fetchClients();
        setClients(savedClients);
      } catch (err) {
        setError(err.message || 'Unable to load clients');
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, [user, fetchClients]);

  // Initialize the Mapbox map once on component mount.
  useEffect(() => {
    if (!MAPBOX_TOKEN) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-122.4376, 37.7577],
      zoom: 11,
    });

    new mapboxgl.Marker().setLngLat([-122.4376, 37.7577]).addTo(map);

    return () => map.remove();
  }, []);

  if (!user) {
    return (
      <div>
        <h2>Route Map</h2>
        <p>Please log in to view your saved client data and route map.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Route Map</h2>
      {hasMapboxToken ? (
        // Mapbox renders here once a token is configured.
        <div ref={mapContainer} data-testid="map-container" style={{ width: '100%', height: '60vh' }} />
      ) : (
        <p style={{ color: '#666' }}>
          Mapbox token is not configured. Add REACT_APP_MAPBOX_TOKEN to show the route map.
        </p>
      )}

      <section style={{ marginTop: 20 }}>
        <h3>Saved clients</h3>
        {loading ? (
          <p>Loading clients...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : clients.length === 0 ? (
          <p>No saved clients available yet.</p>
        ) : (
          <ul>
            {clients.map((client) => (
              <li key={client.id}>
                <strong>{client.name}</strong> — {client.address}
                {/* Show optional dispatcher notes alongside the address for context. */}
                {client.notes ? <span style={{ color: '#666' }}> — {client.notes}</span> : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default MapPage;
