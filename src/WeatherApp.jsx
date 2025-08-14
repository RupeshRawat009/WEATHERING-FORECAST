import React, { useState, useEffect } from "react";
import InfoBox from "./InfoBox";
import ForecastBox from "./ForecastBox";
import "./WeatherApp.css";

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [aqiData, setAqiData] = useState(null);

  const API_KEY = "541da9eb225166b532face0581dbdd2d";

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
    } catch (err) {
      console.error("Error fetching weather:", err);
    }
  };

  // 🌧 Snow/Rain particle effect
  useEffect(() => {
    const container = document.querySelector(".weather-particles");
    if (!container) return;
    container.innerHTML = "";
    if (!weather) return;

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
    if (!weather) return "default-bg";
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

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeather}>Search</button>
      </div>

      <div className="cards">
        <InfoBox weather={weather} />
        {displayAqi && (
          <div className="aqi-box">
            <h3>AQI: {displayAqi}</h3>
          </div>
        )}
        <ForecastBox forecast={forecast} />
      </div>
    </div>
  );
}
