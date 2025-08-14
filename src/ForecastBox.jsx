import React from "react";

export default function ForecastBox({ forecast }) {
  if (!forecast) {
    return (
      <div className="card">
        <h3>Hourly Forecast</h3>
        <h3>Daily Forecast</h3>
      </div>
    );
  }

  // Hourly forecast (next 5)
  const hourly = forecast.list.slice(0, 5);

  // Daily forecast → pick one data point every ~8 items (24h)
  const daily = forecast.list.filter((item, index) => index % 8 === 0);

  return (
    <div className="card forecast-card">
      <h3>Hourly Forecast</h3>
      <div className="forecast-row">
        {hourly.map((hour, i) => (
          <div key={i} className="forecast-item">
            <p>{new Date(hour.dt_txt).getHours()}:00</p>
            <img
              src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
              alt={hour.weather[0].description}
            />
            <p>{Math.round(hour.main.temp)}°C</p>
          </div>
        ))}
      </div>

      <h3>Daily Forecast</h3>
      <div className="forecast-row">
        {daily.map((day, i) => (
          <div key={i} className="forecast-item">
            <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
              alt={day.weather[0].description}
            />
            <p>{Math.round(day.main.temp)}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
}
