import React from 'react';
import { getWeatherIcon } from '../utils/weatherUtils';

const WeatherCard = ({ weather, mountainName }) => {
    if (!weather) return null;

    const { temperature, windspeed, weathercode } = weather;
    const { text, icon } = getWeatherIcon(weathercode);

    return (
        <div className="bg-white/20 backdrop-blur-md rounded-xl p-8 shadow-lg text-center w-full border border-white/30">
            <h2 className="text-3xl font-bold text-white mb-2">{mountainName}</h2>
            <div className="text-6xl my-6">{icon}</div>
            <p className="text-2xl text-white font-semibold mb-4">{text}</p>
            <div className="flex justify-around text-white">
                <div className="flex flex-col">
                    <span className="text-sm opacity-80">기온</span>
                    <span className="text-xl font-bold">{Math.round(temperature)}°C</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm opacity-80">풍속</span>
                    <span className="text-xl font-bold">{windspeed} km/h</span>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;
