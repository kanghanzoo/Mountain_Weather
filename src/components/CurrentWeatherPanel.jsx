import React from 'react';
import { getWeatherIcon } from '../utils/weatherUtils';
import { format, parseISO } from 'date-fns';
import { calculateHikingIndex, getPrecipitationLabel } from '../utils/hikingUtils';

const DetailItem = ({ icon, label, value, subValue, colorClass = "text-white" }) => (
    <div className="bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors border border-white/5">
        <span className="text-xl mb-1 opacity-90">{icon}</span>
        <span className="text-[10px] text-gray-300 font-medium uppercase tracking-wider mb-0.5">{label}</span>
        <span className={`text-lg font-bold ${colorClass}`}>{value}</span>
        {subValue && <span className="text-[9px] text-gray-400">{subValue}</span>}
    </div>
);

const CurrentWeatherPanel = ({ weather, daily, mountainName }) => {
    if (!weather || !daily) return null;

    const { temperature, weathercode, windspeed, apparent_temperature, precipitation, relativehumidity_2m } = weather;
    const { icon, text } = getWeatherIcon(weathercode);
    const sunrise = daily.sunrise[0] ? format(parseISO(daily.sunrise[0]), 'HH:mm') : '--:--';
    const sunset = daily.sunset[0] ? format(parseISO(daily.sunset[0]), 'HH:mm') : '--:--';
    const minTemp = Math.round(daily.temperature_2m_min[0]);
    const maxTemp = Math.round(daily.temperature_2m_max[0]);

    return (
        <div className="glass-panel w-full h-full p-6 flex flex-col justify-between text-white relative overflow-hidden group">

            {/* Top Section: Main Weather Info */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight drop-shadow-md">{mountainName}</h2>
                        <p className="text-xs text-gray-300 font-medium">{format(new Date(), 'M월 d일 (E)')}</p>
                    </div>
                    <div className="text-right text-[10px] text-gray-300 space-y-0.5 bg-black/20 px-2 py-1 rounded-lg border border-white/5">
                        <p>◓ 일출 {sunrise}</p>
                        <p>◒ 일몰 {sunset}</p>
                    </div>
                </div>

                {/* Icon & Temp */}
                <div className="flex-1 flex flex-col justify-center items-center relative z-10 -mt-2">
                    <div className="text-[5rem] leading-none filter drop-shadow-2xl hover:scale-105 transition-transform duration-500">
                        {icon}
                    </div>
                    <div className="flex items-start mt-0">
                        <h1 className="text-6xl font-black tracking-tighter drop-shadow-lg">
                            {Math.round(temperature)}
                        </h1>
                        <span className="text-2xl text-gray-300 mt-2 ml-1 font-light">°</span>
                    </div>
                    <p className="text-lg text-gray-200 font-medium mb-1">{text}</p>

                    {/* Min/Max */}
                    <div className="flex gap-3 text-sm font-medium bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        <span className="text-blue-300">L: {minTemp}°</span>
                        <span className="text-white/20">|</span>
                        <span className="text-red-300">H: {maxTemp}°</span>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Detail Grid */}
            <div className="mt-4 grid grid-cols-4 gap-2">
                <DetailItem
                    icon="🌡️"
                    label="체감"
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
                    label="강수"
                    value={`${getPrecipitationLabel(precipitation)}`}
                />
            </div>

        </div>
    );
};

export default CurrentWeatherPanel;
