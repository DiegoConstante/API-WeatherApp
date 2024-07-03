import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [climate, setClimate] = useState({
    celcius: 10,
    name: "Quito",
    humedad: 10,
    viento: 10,
    imagen: "./public/Nublado.webp",
  });

  const [city, setCity] = useState("Quito");
  const [error, setError] = useState("");

  const fetchWeather = (city) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=b72056876e42d3ad9901ebbadbe68369&units=metric`
    )
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.message);
          });
        }
        return res.json();
      })
      .then((data) => {
        let timeIs = "";
        if (data.weather[0].main === "Clouds") {
          timeIs = "./public/Nublado.webp";
        } else if (data.weather[0].main === "Clear") {
          timeIs = "./public/Soleado.webp";
        } else if (data.weather[0].main === "Rain") {
          timeIs = "./public/Lluvia.webp";
        } else {
          timeIs = "./public/Nublado.webp";
        }

        if (data.main && data.wind) {
          setClimate({
            celcius: data.main.temp,
            name: data.name,
            humedad: data.main.humidity,
            viento: data.wind.speed,
            imagen: timeIs,
          });
        } else {
          throw new Error("Se encontró un error en la respuesta de la API.");
        }
        setError("");
      })
      .catch((err) => {
        setError(err.message);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setError("Ciudad no encontrada");
        } else {
          setError("");
        }
      });
  };

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const handleSearch = () => {
    const inputCity = document.getElementById("city-input").value;
    if (inputCity) {
      setCity(inputCity);
    } else {
      setError("Por favor, ingrese el nombre de una ciudad.");
    }
  };

  return (
    <div className="app">
      <div className="weather-app">
        <div className="search">
          <input
            id="city-input"
            type="text"
            placeholder="Ingrese el Nombre de la Ciudad"
          ></input>
          <button onClick={handleSearch}>
            <img src="./public/lupa.png" alt="lupa"></img>
          </button>
        </div>
        <div className="error-info">
          <p>{error}</p>
        </div>
        <div className="weather-info">
          <img src={climate.imagen} alt="weather condition"></img>
          <h1>{Math.round(climate.celcius)}°C</h1>
          <h2>{climate.name}</h2>
          <div className="description">
            <div className="col">
              <img src="./public/humedad.webp" alt="humedad"></img>
              <div className="description-humedad">
                <p>{Math.round(climate.humedad)}%</p>
                <p>Humedad</p>
              </div>
            </div>
            <div className="col">
              <img
                src="./public/Air Speed.webp"
                alt="Velocidad del Viento"
              ></img>
              <div className="description-viento">
                <p>{Math.round(climate.viento)} km/h</p>
                <p>Viento</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
