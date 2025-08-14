import React from "react";

export default function InfoBox({ weather }) {
  if (!weather) {
    return (
      <div className="card">
        <p>Search for a city to see weather info</p>
      </div>
    );
  }

  const icon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  return (
    <div className="card">
      <h2>{weather.name}, {weather.sys.country}</h2>
      <img src={icon} alt={weather.weather[0].description} />
      <h3>{Math.round(weather.main.temp)}°C</h3>
      <p>{weather.weather[0].description}</p>
      <p>Humidity: {weather.main.humidity}%</p>
      <p>Wind: {weather.wind.speed} m/s</p>
    </div>
  );
}
