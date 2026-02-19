import React, { useMemo } from 'react';
import { getWeatherIcon } from '../utils/weatherUtils';
import { calculateHikingIndex, getPrecipitationLabel } from '../utils/hikingUtils';
import { format, parseISO } from 'date-fns';

const WeatherCard = ({ weather, daily, mountainName, naturalMode = false }) => {
    if (!weather || !daily) return null;

    const { temperature, windspeed, weathercode, apparent_temperature, precipitation, relativehumidity_2m } = weather;
    const { text, icon } = getWeatherIcon(weathercode);
    const sunrise = daily.sunrise[0] ? format(parseISO(daily.sunrise[0]), 'HH:mm') : '--:--';
    const sunset = daily.sunset[0] ? format(parseISO(daily.sunset[0]), 'HH:mm') : '--:--';

    const hikingIndex = useMemo(() =>
        calculateHikingIndex(temperature, windspeed, precipitation, relativehumidity_2m),
        [temperature, windspeed, precipitation, relativehumidity_2m]
    );

    // Conditional styles based on naturalMode
    const containerClasses = naturalMode
        ? "text-white w-full h-full flex flex-col justify-center" // No BG, No Border
        : "bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/20 text-white w-full h-full flex flex-col justify-between";

    return (
        <div className={containerClasses}>

            {/* Header: Sunrise/Sunset - Transparent Pill */}
            <div className="flex-none flex justify-center mb-6">
                <div className="flex justify-between text-xs opacity-90 bg-black/30 backdrop-blur-sm py-1 px-4 rounded-full gap-4 shadow-sm border border-white/10">
                    <span>🌅 일출 {sunrise}</span>
                    <span className="opacity-30">|</span>
                    <span>🌇 일몰 {sunset}</span>
                </div>
            </div>

            {/* Main Weather Info (Centered) */}
            <div className="flex flex-col justify-center items-center text-center">
                <h2 className="text-3xl font-bold mb-2 drop-shadow-md">{mountainName}</h2>

                {/* Responsive Icon Size - Slightly smaller based on feedback */}
                <div className="text-[5rem] lg:text-[6rem] leading-none my-2 drop-shadow-xl filter hover:scale-105 transition-transform duration-300 transform">{icon}</div>

                <div className="flex flex-col items-center">
                    <div className="text-6xl font-extrabold flex items-start drop-shadow-lg">
                        {Math.round(temperature)}<span className="text-3xl mt-2 opacity-80">°C</span>
                    </div>
                    <p className="text-base font-medium opacity-90 mt-1 drop-shadow-md">체감 {Math.round(apparent_temperature)}°C</p>
                </div>

                <p className="text-2xl font-bold mt-3 drop-shadow-md">{text}</p>
            </div>

            {/* Grid Stats (Glassmorphism Pills) */}
            <div className="flex-none grid grid-cols-4 gap-3 mt-10 px-4">

                <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-2 flex flex-col items-center justify-center min-h-[70px] border border-white/5 hover:bg-black/30 transition-colors">
                    <span className="text-xl mb-1">💧</span>
                    <span className="text-[10px] opacity-70">강수량</span>
                    <span className="font-bold text-sm">{getPrecipitationLabel(precipitation)}</span>
                </div>

                <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-2 flex flex-col items-center justify-center min-h-[70px] border border-white/5 hover:bg-black/30 transition-colors">
                    <span className="text-xl mb-1">💧</span>
                    <span className="text-[10px] opacity-70">습도</span>
                    <span className="font-bold text-sm">{relativehumidity_2m}%</span>
                </div>

                <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-2 flex flex-col items-center justify-center min-h-[70px] border border-white/5 hover:bg-black/30 transition-colors">
                    <span className="text-xl mb-1">💨</span>
                    <span className="text-[10px] opacity-70">풍속</span>
                    <span className="font-bold text-sm">{windspeed}m/s</span>
                </div>

                <div className={`bg-black/20 backdrop-blur-sm rounded-2xl p-2 flex flex-col items-center justify-center min-h-[70px] border-2 border-transparent ${hikingIndex.color.replace('text', 'border')} hover:bg-black/30 transition-colors`}>
                    <span className="text-xl mb-1">🧗</span>
                    <span className="text-[10px] opacity-70">등산지수</span>
                    <span className={`font-bold text-sm ${hikingIndex.color}`}>{hikingIndex.text}</span>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;
