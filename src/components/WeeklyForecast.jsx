import React from 'react';
import { getWeatherIcon } from '../utils/weatherUtils';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

const WeeklyForecast = ({ daily }) => {
    if (!daily) return null;

    const forecasts = daily.time.slice(1, 8).map((time, index) => {
        const idx = index + 1;
        const code = daily.weathercode[idx];
        const maxTemp = Math.round(daily.temperature_2m_max[idx]);
        const minTemp = Math.round(daily.temperature_2m_min[idx]);
        const iconData = getWeatherIcon(code);
        const date = parseISO(time);

        return {
            date: date,
            dayShort: format(date, 'E', { locale: ko }),
            dateStr: format(date, 'M.d'),
            icon: iconData.icon,
            text: iconData.text,
            max: maxTemp,
            min: minTemp
        };
    });

    return (
        <div className="glass-panel w-full h-full p-6 flex flex-col overflow-hidden">
            {/* Title standardized to text-xl */}
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 drop-shadow-md shrink-0">
                <span>📅</span> 주간 예보
            </h3>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                <div className="flex flex-col gap-2">
                    {forecasts.map((forecast, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group border border-white/5"
                        >
                            {/* 1. Date (Smaller Font) */}
                            <div className="w-24 flex items-baseline gap-2">
                                <span className="text-white font-bold text-lg">{forecast.dateStr}</span>
                                <span className="text-gray-400 text-sm">{forecast.dayShort}</span>
                            </div>

                            {/* 2. Icon + Text (Left Aligned, Smaller Font) */}
                            <div className="flex-1 flex items-center justify-start gap-3 pl-2">
                                <div className="text-2xl">
                                    {forecast.icon}
                                </div>
                                <span className="text-sm text-gray-200 font-medium">{forecast.text}</span>
                            </div>

                            {/* 3. Temps (Smaller Font) */}
                            <div className="w-20 flex justify-end items-center gap-1.5">
                                <span className="text-blue-300 font-medium text-base">{forecast.min}°</span>
                                <span className="text-gray-600 text-xs">/</span>
                                <span className="text-red-300 font-bold text-base">{forecast.max}°</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WeeklyForecast;
