import React from 'react';
import { getWeatherIcon } from '../utils/weatherUtils';

const WeeklyForecast = ({ daily }) => {
    if (!daily) return null;

    return (
        <div className="w-full max-w-sm mx-auto mt-6 mb-10">
            <h3 className="text-white text-lg font-bold mb-3 px-2">주간 예보</h3>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30">
                {daily.time.map((time, index) => {
                    const date = new Date(time);
                    const dayName = new Intl.DateTimeFormat('ko-KR', { weekday: 'short' }).format(date);
                    const { icon, text } = getWeatherIcon(daily.weathercode[index]);
                    const minTemp = Math.round(daily.temperature_2m_min[index]);
                    const maxTemp = Math.round(daily.temperature_2m_max[index]);

                    return (
                        <div key={index} className="flex justify-between items-center py-3 border-b border-white/20 last:border-0 pl-2 pr-2">
                            <span className="text-white font-semibold w-12">{dayName}</span>
                            <div className="flex items-center flex-1 justify-center">
                                <span className="text-2xl mr-2">{icon}</span>
                                <span className="text-white text-sm opacity-90 hidden sm:block">{text}</span>
                            </div>
                            <div className="flex w-24 justify-end text-white">
                                <span className="opacity-70 mr-2">{minTemp}°</span>
                                <span className="font-bold">{maxTemp}°</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WeeklyForecast;
