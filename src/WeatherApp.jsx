import React, { useState, useEffect } from "react";
import InfoBox from "./InfoBox";
import ForecastBox from "./ForecastBox";
import LeafletMap from "./LeafletMap";

import "./WeatherApp.css";
// Add this array of facts at the top of your WeatherApp.jsx (outside the component)
const weatherFacts = [
  "The highest temperature ever recorded was 56.7 °C in Death Valley.",
  "Raindrops can fall at speeds up to 22 mph (about 35 km/h).",
  "Lightning heats the air around it to over 30,000 °C—five times hotter than the surface of the sun!",
  "A single cumulus cloud can weigh over 1 million pounds.",
  "The coldest temperature ever recorded on Earth was −89.2 °C in Antarctica.",
  "Hailstones the size of softballs have been recorded in the US.",
  "Fog is basically a cloud that touches the ground.",
  "The Sahara Desert can be colder at night than many European cities.",
];

// Inside your component (WeatherApp)
const randomFact =
  weatherFacts[Math.floor(Math.random() * weatherFacts.length)];

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [error, setError] = useState(""); // ✅ added: hold "city not found" or other errors

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  // ✅ AQI calculation from PM2.5
  function calculateAQI(pm25) {
    const breakpoints = [
      { cLow: 0, cHigh: 12, iLow: 0, iHigh: 50 },
      { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
      { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
      { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
      { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
      { cLow: 250.5, cHigh: 350.4, iLow: 301, iHigh: 400 },
      { cLow: 350.5, cHigh: 500.4, iLow: 401, iHigh: 500 },
    ];

    let bp = breakpoints.find(
      (b) => pm25 >= b.cLow && pm25 <= b.cHigh
    );
    if (!bp) return null;

    return Math.round(
      ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (pm25 - bp.cLow) + bp.iLow
    );
  }

  function getAqiCategory(aqi) {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  }

  const getWeather = async () => {
    if (!city) return;

    try {
      // ✅ Weather
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const weatherData = await weatherRes.json();

      // ✅ handle wrong city (prevents white screen)
      if (weatherData.cod !== 200) {
        setError("⚠️ City not found. Please try again.");
        setWeather(null);
        setForecast(null);
        setAqiData(null);
        return ;
      }

      // ✅ Forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastRes.json();

      // ✅ AQI
      if (weatherData.coord) {
        const aqiRes = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${API_KEY}`
        );
        const aqiJson = await aqiRes.json();
        setAqiData(aqiJson.list[0]); // store full data for PM2.5 calc
      }

      setWeather(weatherData);
      setForecast(forecastData);
      setError(""); // ✅ clear any previous error
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  // 🌧 Snow/Rain particle effect
  useEffect(() => {
    const container = document.querySelector(".weather-particles");
    if (!container) return;
    container.innerHTML = "";
    if (!weather || !weather.weather) return; // ✅ guard to prevent crash

    const condition = weather.weather[0].main.toLowerCase();
    const isRain = condition.includes("rain") || condition.includes("drizzle");
    const isSnow = condition.includes("snow");
    if (!isRain && !isSnow) return;

    const particleCount = isSnow ? 60 : 120;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("span");
      particle.className = isSnow ? "snowflake" : "raindrop";
      particle.style.left = Math.random() * 100 + "vw";
      particle.style.animationDuration = 2 + Math.random() * (isSnow ? 6 : 1) + "s";
      particle.style.opacity = Math.random();
      particle.style.fontSize = (isSnow ? 10 : 2) + Math.random() * (isSnow ? 10 : 2) + "px";
      container.appendChild(particle);
    }
  }, [weather]);

  const getBackgroundClass = () => {
    if (!weather || !weather.weather) return "default-bg"; // ✅ guard to prevent crash
    const condition = weather.weather[0].main.toLowerCase();
    if (condition.includes("clear")) return "clear-bg";
    if (condition.includes("cloud")) return "cloudy-bg";
    if (condition.includes("rain") || condition.includes("drizzle")) return "rainy-bg";
    if (condition.includes("snow")) return "snow-bg";
    if (condition.includes("mist") || condition.includes("fog") || condition.includes("haze")) return "misty-bg";
    return "default-bg";
  };

  let displayAqi = null;
  if (aqiData) {
    const pm25 = aqiData.components.pm2_5;
    const aqiValue = calculateAQI(pm25);
    displayAqi = `${aqiValue} — ${getAqiCategory(aqiValue)}`;
  }

  return (
    <div className={`weather-app ${getBackgroundClass()}`}>
      <div className="weather-particles"></div>

      {/* ✅ Hero Section */}
      <section className="hero">
        <h1>Your Weather, Your Way</h1>
        <p>Get real-time weather, forecasts, and air quality updates.</p>
      </section>

      {/* ✅ Search Bar with CTA */}
      <div className="search-box">
        <input
          type="text"
          placeholder="🌤️ Start by typing a city above to see the weather forecast"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeather}>🔍 Search Your City</button>
      </div>

      {/* ❌ Error Message */}
     {error && (
  <p style={{ 
    backgroundColor: '#e7e1e1ff', 
    color: '#000000ff',
    border: '1px solid #d43f3a',
    padding: '10px 15px',
    marginTop: '10px',
    borderRadius: '6px',
    fontWeight: '500',
    textAlign: 'center'
  }}>
    {error}
  </p>
)}
     

      {/* ✅ Feature Highlights */}
      <div className="features">
        <div className="card-feat">🌡️ Temperature</div>
        <div className="card-feat">💧 Humidity</div>
        <div className="card-feat">🌬️ Wind Speed</div>
        <div className="card-feat">🌫️ AQI</div>
      </div>

      {/* ✅ Weather Data */}
      <div className="cards">
        <InfoBox weather={weather} />
        {displayAqi && (
          <div className="aqi-box">
            <h3>AQI: {displayAqi}</h3>
          </div>
        )}
        <ForecastBox forecast={forecast} />
      </div>

      {/* ✅ Interactive Map */}
      <LeafletMap onSelectCity={(coords) => console.log("Clicked:", coords)} />

      {/* ✅ Fun Fact / Quote */}
      <div className="quote">
        <p>🌍 Did you know? {randomFact}</p>
      </div>

      {/* ✅ Footer */}
      <footer>
        <p>Built by RUPESH | Powered by OpenWeather API</p>
      </footer>
    </div>
  );
}
