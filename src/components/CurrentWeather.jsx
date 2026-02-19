import React from 'react';
import { getWeatherIcon } from '../utils/weatherUtils';
import { format, parseISO } from 'date-fns';

const CurrentWeather = ({ weather, daily, mountainName }) => {
    if (!weather || !daily) return null;

    const { temperature, weathercode } = weather;
    const { icon, text } = getWeatherIcon(weathercode);
    const sunrise = daily.sunrise[0] ? format(parseISO(daily.sunrise[0]), 'HH:mm') : '--:--';
    const sunset = daily.sunset[0] ? format(parseISO(daily.sunset[0]), 'HH:mm') : '--:--';

    return (
        <div className="glass-panel w-full h-full p-6 flex flex-col justify-between text-white relative overflow-hidden group">
            {/* Dynamic Glow Effect (Optional) */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-700"></div>

            {/* Header: Mountain Name & Sun Times */}
            <div className="flex justify-between items-start z-10">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight drop-shadow-md">{mountainName}</h2>
                    <p className="text-sm text-gray-300 mt-1 font-medium">{format(new Date(), 'M월 d일 (E)')}</p>
                </div>
                <div className="text-right text-xs text-gray-400 space-y-1">
                    <p>◓ 일출 {sunrise}</p>
                    <p>◒ 일몰 {sunset}</p>
                </div>
            </div>

            {/* Main Content: Temp & Icon */}
            <div className="flex-1 flex flex-col justify-center items-center relative z-10">
                <div className="text-[5rem] lg:text-[7rem] leading-none filter drop-shadow-2xl hover:scale-105 transition-transform duration-500">
                    {icon}
                </div>
                <div className="flex items-start mt-2">
                    <h1 className="text-7xl lg:text-8xl font-black tracking-tighter drop-shadow-lg">
                        {Math.round(temperature)}
                    </h1>
                    <span className="text-3xl text-gray-300 mt-4 ml-1 font-light">°</span>
                </div>
                <p className="text-xl text-gray-200 font-medium mt-2">{text}</p>
            </div>
        </div>
    );
};

export default CurrentWeather;
