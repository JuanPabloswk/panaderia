import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function Map() {
  const position = [4.711, -74.0721]; // Ejemplo: Bogotá (latitud, longitud)

  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ height: "400px", width: "100%", borderRadius: "12px" }}
    >
      {/* Capa base del mapa (OpenStreetMap) */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Marcador en la panadería */}
      <Marker position={position}>
        <Popup>
          📍 Panadería Dulce Sabor <br /> ¡Te esperamos aquí!
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default Map