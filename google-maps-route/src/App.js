import React, { useState } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  useLoadScript,
  Marker,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const center = { lat: 28.6139, lng: 77.2090 }; // Default center (New Delhi)

const App = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyD_-xDNNCwymBlx7Tl4VB3wC7aZrX9F_0g", // Replace with your API Key
  });

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [directions, setDirections] = useState(null);

  const getRoute = () => {
    if (!start || !end) {
      alert("Please select both start and end locations");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: start,
        destination: end,
        travelMode: "DRIVING",
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        } else {
          alert("Could not find route: " + status);
        }
      }
    );
  };

  const handleMapClick = (event) => {
    const clickedLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    if (!start) {
      setStart(clickedLocation); // First click sets start
    } else if (!end) {
      setEnd(clickedLocation); // Second click sets end
    } else {
      // If both are set, reset and start over
      setStart(clickedLocation);
      setEnd(null);
      setDirections(null);
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Find Fastest Route</h2>

      <div>
        <p>
          {!start ? "Click to select START location" : 
           !end ? "Click to select END location" : 
           "Click again to reset"}
        </p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Start Latitude"
          value={start ? start.lat : ""}
          readOnly
        />
        <input
          type="text"
          placeholder="Start Longitude"
          value={start ? start.lng : ""}
          readOnly
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="End Latitude"
          value={end ? end.lat : ""}
          readOnly
        />
        <input
          type="text"
          placeholder="End Longitude"
          value={end ? end.lng : ""}
          readOnly
        />
      </div>

      <button onClick={getRoute} disabled={!start || !end}>
        Get Route
      </button>

      <div style={{ marginTop: "20px" }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={10}
          onClick={handleMapClick}
        >
          {start && <Marker position={start} label="S" />}
          {end && <Marker position={end} label="E" />}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>
    </div>
  );
};

export default App;
