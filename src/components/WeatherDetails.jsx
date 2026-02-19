import React, { useMemo } from 'react';
import { calculateHikingIndex, getPrecipitationLabel } from '../utils/hikingUtils';

const DetailItem = ({ icon, label, value, subValue, colorClass = "text-white" }) => (
    <div className="bg-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors border border-white/5">
        <span className="text-2xl mb-2 opacity-80">{icon}</span>
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{label}</span>
        <span className={`text-xl font-bold ${colorClass}`}>{value}</span>
        {subValue && <span className="text-[10px] text-gray-500 mt-1">{subValue}</span>}
    </div>
);

const WeatherDetails = ({ weather }) => {
    if (!weather) return null;

    const { windspeed, apparent_temperature, precipitation, relativehumidity_2m } = weather;

    // Use memo for efficient calc if needed, though simple here
    const hikingIndex = calculateHikingIndex(weather.temperature, windspeed, precipitation, relativehumidity_2m);

    return (
        <div className="glass-panel w-full h-full p-4 grid grid-cols-2 gap-3">
            <DetailItem
                icon="🌡️"
                label="체감 온도"
                value={`${Math.round(apparent_temperature)}°`}
            />
            <DetailItem
                icon="💧"
                label="습도"
                value={`${relativehumidity_2m}%`}
            />
            <DetailItem
                icon="💨"
                label="풍속"
                value={`${windspeed}`}
                subValue="m/s"
            />
            <DetailItem
                icon="🌧️"
                label="강수확률"
                value={`${getPrecipitationLabel(precipitation)}`}
            />
            {/* Or Hiking Index? The user requested Winds, Humidity, FeelsLike, Precip. */}
            {/* Let's stick to user request. Hiking Index could be extra or replace precip if 0? */}
        </div>
    );
};

export default WeatherDetails;
