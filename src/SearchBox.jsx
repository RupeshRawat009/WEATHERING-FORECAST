import "./SearchBox.css";
import { useState } from "react";

export default function SearchBox({ updateInfo }) {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://api.openweathermap.org/data/2.5/weather";
  const API_KEY = "541da9eb225166b532face0581dbdd2d";

  const getWeatherInfo = async () => {
    try {
      const response = await fetch(
        `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`
      );
      const jsonResponse = await response.json();

      // ✅ Check if API says error
      if (jsonResponse.cod !== 200) {
        throw new Error("City not found");
      }

      return {
        city: city,
        temp: jsonResponse.main.temp,
        tempMin: jsonResponse.main.temp_min,
        tempMax: jsonResponse.main.temp_max,
        humidity: jsonResponse.main.humidity,
        feelsLike: jsonResponse.main.feels_like,
        pressure: jsonResponse.main.pressure,
        weather: jsonResponse.weather[0].description,
      };
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("City not found. Please try again.");
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!city.trim()) return;

    setLoading(true);
    const newInfo = await getWeatherInfo();
    if (newInfo) {
      updateInfo(newInfo);
      setCity("");
    }
    setLoading(false);
  };

  return (
    <div className="search-box glass-card">
      <h3>Enter a city to get the latest forecast</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="City Name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>
      </form>
      {/* ✅ This will now work without crashing */}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
