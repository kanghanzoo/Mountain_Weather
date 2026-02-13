import React from 'react';
import { getWeatherIcon } from '../utils/weatherUtils';

const HourlyForecast = ({ hourly }) => {
    if (!hourly) return null;

    const now = new Date();
    const currentHour = now.getHours();

    // Get next 24 hours of data
    // The API returns arrays of time, temperature_2m, weathercode
    // We need to find the index of the current hour

    const timeArray = hourly.time.map(t => new Date(t));
    const startIndex = timeArray.findIndex(t => t.getHours() === currentHour);

    // If we can't find exact match, start from 0, or handle gracefully
    const start = startIndex !== -1 ? startIndex : 0;
    const end = start + 24;

    const hours = hourly.time.slice(start, end);
    const temps = hourly.temperature_2m.slice(start, end);
    const codes = hourly.weathercode.slice(start, end);

    return (
        <div className="w-full max-w-sm mx-auto mt-6">
            <h3 className="text-white text-lg font-bold mb-3 px-2">시간별 예보</h3>
            <div className="flex overflow-x-auto pb-4 space-x-4 px-2 scrollbar-hide">
                {hours.map((time, index) => {
                    const date = new Date(time);
                    const hour = date.getHours();
                    const { icon } = getWeatherIcon(codes[index]);

                    return (
                        <div key={index} className="flex flex-col items-center min-w-[60px] bg-white/10 rounded-lg p-2 backdrop-blur-sm border border-white/20">
                            <span className="text-white text-sm mb-1">{hour}시</span>
                            <span className="text-2xl mb-1">{icon}</span>
                            <span className="text-white font-bold">{Math.round(temps[index])}°</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HourlyForecast;
