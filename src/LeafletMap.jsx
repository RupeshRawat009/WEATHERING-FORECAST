import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const { BaseLayer, Overlay } = LayersControl;

const LeafletMap = () => {
 const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;


  return (
 <MapContainer
  center={[20, 77]}
  zoom={4}
  style={{
    height: "400px",
    width: "40%",       // smaller width so it doesn’t stretch full screen
    margin: "20px auto", // centers it horizontally
    borderRadius: "15px", // rounded corners
    overflow: "hidden",   // prevents tiles from going outside corners
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)" // (optional) adds a nice shadow
  }}
>


      <LayersControl position="topright">
        {/* Base map */}
        <BaseLayer checked name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
        </BaseLayer>

        {/* Weather layers from OpenWeatherMap */}
        <Overlay checked name="Temperature">
          <TileLayer
            url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
            attribution="&copy; <a href='https://openweathermap.org/'>OpenWeatherMap</a>"
          />
        </Overlay>

        <Overlay name="Precipitation">
          <TileLayer
            url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
            attribution="&copy; <a href='https://openweathermap.org/'>OpenWeatherMap</a>"
          />
        </Overlay>

        <Overlay name="Clouds">
          <TileLayer
            url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
            attribution="&copy; <a href='https://openweathermap.org/'>OpenWeatherMap</a>"
          />
        </Overlay>

        <Overlay name="Wind">
          <TileLayer
            url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
            attribution="&copy; <a href='https://openweathermap.org/'>OpenWeatherMap</a>"
          />
        </Overlay>
      </LayersControl>
    </MapContainer>
  );
};

export default LeafletMap;
