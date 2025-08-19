import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./LeafletMap.css"

const { BaseLayer, Overlay } = LayersControl;

const LeafletMap = () => {
 const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;


  return (
<MapContainer
  center={[20, 77]}
  zoom={4}
  className="map-container"
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
