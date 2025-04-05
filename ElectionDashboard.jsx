// App.jsx
import React from "react";
import ElectionDashboard from "./ElectionDashboard";

function App() {
  return (
    <div className="App">
      <ElectionDashboard />
    </div>
  );
}

export default App;


// ElectionDashboard.jsx
import React, { useEffect, useState } from "react";
import MapMunicipio from "./components/MapMunicipio";
import MapUU from "./components/MapUU";
import ChartMunicipio from "./components/ChartMunicipio";
import ChartUU from "./components/ChartUU";

const ElectionDashboard = () => {
  const [geoMunicipi, setGeoMunicipi] = useState(null);
  const [geoUU, setGeoUU] = useState(null);
  const [dati, setDati] = useState([]);

  useEffect(() => {
    fetch("/data/Mappa-municipi.geojson")
      .then((res) => res.json())
      .then(setGeoMunicipi);

    fetch("/data/Map-uu.geojson")
      .then((res) => res.json())
      .then(setGeoUU);

    fetch("/data/percentuali.json")
      .then((res) => res.json())
      .then(setDati);
  }, []);

  return (
    <div>
      <h1>Dashboard Elettorale</h1>
      <h2>Mappa Municipi</h2>
      {geoMunicipi && <MapMunicipio geoJsonData={geoMunicipi} />}
      <h2>Grafico per Municipio</h2>
      <ChartMunicipio data={dati} />
      <h2>Mappa UU</h2>
      {geoUU && <MapUU geoJsonData={geoUU} />}
      <h2>Grafico per UU</h2>
      <ChartUU data={dati} />
    </div>
  );
};

export default ElectionDashboard;


// components/MapMunicipio.jsx
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapMunicipio = ({ geoJsonData }) => (
  <MapContainer center={[44.411, 8.932]} zoom={11} style={{ height: "400px", width: "100%" }}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <GeoJSON data={geoJsonData} />
  </MapContainer>
);

export default MapMunicipio;


// components/MapUU.jsx
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapUU = ({ geoJsonData }) => (
  <MapContainer center={[44.411, 8.932]} zoom={11} style={{ height: "400px", width: "100%" }}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <GeoJSON data={geoJsonData} />
  </MapContainer>
);

export default MapUU;


// components/ChartMunicipio.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ChartMunicipio = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <XAxis dataKey="Municipio" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="PD" fill="#1976d2" />
    </BarChart>
  </ResponsiveContainer>
);

export default ChartMunicipio;


// components/ChartUU.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ChartUU = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <XAxis dataKey="UU" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="PD" fill="#43a047" />
    </BarChart>
  </ResponsiveContainer>
);

export default ChartUU;

};

export default ElectionDashboard;
