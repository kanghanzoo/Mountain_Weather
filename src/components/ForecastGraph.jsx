import React, { useState, useRef, useMemo } from 'react';
import {
    ComposedChart,
    Line,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceArea
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { getWeatherIcon } from '../utils/weatherUtils';

const CustomTick = ({ x, y, payload }) => {
    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={16} textAnchor="middle" fill="#e0e0e0" fontSize={11}>
                {format(payload.value, 'd일 HH시')}
            </text>
        </g>
    );
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const dataPoint = payload[0].payload;
        return (
            <div className="bg-[#1a1a1a] p-3 rounded-xl border border-white/20 text-white text-center shadow-2xl z-50">
                <p className="mb-2 font-bold text-base border-b border-white/10 pb-1 text-blue-200">{format(label, 'M월 d일 HH시')}</p>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-3xl">{dataPoint.icon}</span>
                    <span className="text-lg font-bold">{dataPoint.weatherText}</span>
                </div>
                <div className="flex justify-between gap-3 text-xs">
                    <div className="flex flex-col bg-white/5 p-1.5 rounded">
                        <span className="text-gray-400">기온</span>
                        <span className="text-yellow-400 font-bold text-base">{dataPoint.temp}°</span>
                    </div>
                    <div className="flex flex-col bg-white/5 p-1.5 rounded">
                        <span className="text-gray-400">습도</span>
                        <span className="text-blue-300 font-bold text-base">{dataPoint.humidity}%</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

const ForecastGraph = ({ hourly, daily }) => {
    if (!hourly) return null;

    const fullData = useMemo(() => {
        return hourly.time.slice(0, 72).map((time, index) => {
            const code = hourly.weathercode[index];
            const iconData = getWeatherIcon(code);
            return {
                timestamp: parseISO(time).getTime(),
                temp: hourly.temperature_2m[index],
                humidity: hourly.relativehumidity_2m ? hourly.relativehumidity_2m[index] : 0,
                precip: hourly.precipitation_probability ? hourly.precipitation_probability[index] : 0,
                icon: iconData.icon,
                weatherText: iconData.text
            };
        });
    }, [hourly]);

    const MAX_ITEMS = 72;
    const MIN_WINDOW_SIZE = 8;
    const DEFAULT_WINDOW_SIZE = 18;

    const [windowState, setWindowState] = useState({
        start: 0,
        end: DEFAULT_WINDOW_SIZE
    });

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startIdx, setStartIdx] = useState(0);
    const containerRef = useRef(null);

    const currentData = fullData.slice(windowState.start, windowState.end);

    const nightAreas = useMemo(() => {
        const areas = [];
        if (daily) {
            daily.time.forEach((day, i) => {
                if (i < 4) {
                    let sunset = daily.sunset[i] ? parseISO(daily.sunset[i]).getTime() : null;
                    let nextSunrise = daily.sunrise[i + 1] ? parseISO(daily.sunrise[i + 1]).getTime() : null;
                    if (sunset && nextSunrise) {
                        areas.push({ x1: sunset, x2: nextSunrise });
                    }
                }
            });
        }
        return areas;
    }, [daily]);

    const handleWheel = (e) => {
        const ZOOM_SPEED = 2;
        const direction = e.deltaY > 0 ? 1 : -1;
        setWindowState(prev => {
            const currentSize = prev.end - prev.start;
            let newSize = currentSize + (direction * ZOOM_SPEED);
            if (newSize < MIN_WINDOW_SIZE) newSize = MIN_WINDOW_SIZE;
            if (newSize > MAX_ITEMS) newSize = MAX_ITEMS;
            let shift = Math.floor((currentSize - newSize) / 2);
            let newStart = prev.start + shift;
            let newEnd = newStart + newSize;
            if (newStart < 0) { newStart = 0; newEnd = newSize; }
            if (newEnd > MAX_ITEMS) { newEnd = MAX_ITEMS; newStart = MAX_ITEMS - newSize; }
            return { start: newStart, end: newEnd };
        });
    };
    const handleMouseDown = (e) => { setIsDragging(true); setStartX(e.clientX); setStartIdx(windowState.start); };
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const pixelLines = e.clientX - startX;
        const deltaIdx = -Math.round(pixelLines / 20);
        setWindowState(prev => {
            const size = prev.end - prev.start;
            let newStart = startIdx + deltaIdx;
            let newEnd = newStart + size;
            if (newStart < 0) { newStart = 0; newEnd = size; }
            if (newEnd > MAX_ITEMS) { newEnd = MAX_ITEMS; newStart = MAX_ITEMS - size; }
            return { start: newStart, end: newEnd };
        });
    };
    const handleMouseUp = () => { setIsDragging(false); };

    return (
        <div
            className="w-full h-full flex flex-col relative select-none cursor-grab active:cursor-grabbing overflow-hidden p-2"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            ref={containerRef}
        >
            <div className="absolute top-6 left-6 z-10 pointer-events-none flex items-center justify-between w-full pr-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-2 drop-shadow-md">
                    <span>📈</span> 3일 상세 예보
                </h3>
                {/* Removed Night Legend as requested */}
            </div>

            <div className="flex-1 w-full min-h-[0] mt-8">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={currentData}
                        margin={{ top: 50, right: 10, bottom: 0, left: -20 }}
                    >
                        <defs>
                            <linearGradient id="colorHumid" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        {nightAreas.map((area, idx) => (
                            <ReferenceArea
                                key={`night-${idx}`}
                                x1={area.x1}
                                x2={area.x2}
                                fill="#1e1b4b" /* indigo-950 */
                                fillOpacity={0.6}
                                ifOverflow="visible"
                            />
                        ))}

                        <CartesianGrid stroke="#ffffff" strokeOpacity={0.1} vertical={false} />

                        <XAxis
                            dataKey="timestamp"
                            type="number"
                            domain={['dataMin', 'dataMax']}
                            tick={<CustomTick />}
                            interval="preserveStartEnd"
                            tickCount={6}
                            scale="time"
                            axisLine={{ stroke: '#ffffff', strokeOpacity: 0.2 }}
                        />

                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            stroke="#fbbf24"
                            domain={['auto', 'auto']}
                            tick={{ fill: '#fbbf24', fontSize: 11, fontWeight: 'bold' }}
                            width={40}
                            tickFormatter={(val) => `${val}°`}
                            axisLine={false}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#60a5fa"
                            domain={[0, 100]}
                            tick={{ fill: '#60a5fa', fontSize: 11 }}
                            width={40}
                            tickFormatter={(val) => `${val}%`}
                            axisLine={false}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        <Area
                            yAxisId="right"
                            type="monotone"
                            dataKey="humidity"
                            stroke="#60a5fa"
                            fillOpacity={1}
                            fill="url(#colorHumid)"
                            strokeWidth={2}
                            animationDuration={300}
                        />

                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="temp"
                            stroke="#fbbf24"
                            strokeWidth={3}
                            dot={{ r: 3, fill: '#fbbf24', stroke: 'none' }}
                            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                            animationDuration={300}
                        />

                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ForecastGraph;
