import { useEffect, useState } from 'react';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LocateFixed, Navigation, Star } from 'lucide-react';

const CENTER = [12.9719, 77.6412];

const markerIcon = L.divIcon({
  className: 'care-marker',
  html: '<span class="care-marker-pin"><span></span></span>',
  iconSize: [28, 36],
  iconAnchor: [14, 34],
  popupAnchor: [0, -30],
});

const userIcon = L.divIcon({
  className: 'care-marker care-marker-user',
  html: '<span class="care-marker-pin"><span></span></span>',
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

function Recenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 14, { duration: 1.1 });
  }, [map, position]);
  return null;
}

export default function CareMap({ specialists = [], onBook }) {
  const [userPosition, setUserPosition] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState(null);

  function locateUser() {
    if (!navigator.geolocation) {
      setLocateError('Location is not supported by this browser.');
      return;
    }
    setLocating(true);
    setLocateError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition([position.coords.latitude, position.coords.longitude]);
        setLocating(false);
      },
      () => {
        setLocateError('Location permission denied.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  return (
    <div className="care-map">
      <MapContainer
        center={CENTER}
        zoom={13}
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl
        className="care-map-canvas"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        <Circle
          center={CENTER}
          radius={3200}
          pathOptions={{ color: '#0f766e', weight: 1, fillColor: '#0f766e', fillOpacity: 0.06 }}
        />

        {specialists.map((specialist) => (
          <Marker key={specialist.id} position={[specialist.lat, specialist.lng]} icon={markerIcon}>
            <Popup>
              <strong>{specialist.name}</strong>
              <span className="map-popup-meta">
                <Star size={11} /> {specialist.rating} · {specialist.distance}
              </span>
              <button type="button" onClick={() => onBook?.(specialist.name)}>
                Request appointment
              </button>
            </Popup>
          </Marker>
        ))}

        {userPosition && (
          <Marker position={userPosition} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        <Recenter position={userPosition} />
      </MapContainer>

      <div className="care-map-overlay">
        <span className="care-map-badge">
          <Navigation size={13} />
          {specialists.length} clinics in view
        </span>
        <button
          type="button"
          className="care-map-locate"
          onClick={locateUser}
          disabled={locating}
          title="Use my location"
        >
          <LocateFixed size={16} />
          {locating ? 'Locating…' : 'Near me'}
        </button>
      </div>

      {locateError && (
        <span className="care-map-error" role="status">
          {locateError}
        </span>
      )}
    </div>
  );
}
