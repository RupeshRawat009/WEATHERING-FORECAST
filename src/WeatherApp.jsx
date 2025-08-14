import React, { useState, useEffect } from "react";
import InfoBox from "./InfoBox";
import ForecastBox from "./ForecastBox";
import "./WeatherApp.css";

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const API_KEY = "541da9eb225166b532face0581dbdd2d";

  const getWeather = async () => {
    if (!city) return;

    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const weatherData = await weatherRes.json();

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastRes.json();

      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      console.error("Error fetching weather:", err);
    }
  };

  // Add particles when weather changes
  useEffect(() => {
    const container = document.querySelector(".weather-particles");
    if (!container) return;

    container.innerHTML = ""; // Clear old particles

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

  return (
    <div className={`weather-app ${getBackgroundClass()}`}>
      {/* Particle container */}
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
        <ForecastBox forecast={forecast} />
      </div>
    </div>
  );
}
