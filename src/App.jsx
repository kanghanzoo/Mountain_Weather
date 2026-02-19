import { useState, useEffect } from 'react';
import CurrentWeatherPanel from './components/CurrentWeatherPanel'; // Merged Component
import WeeklyForecast from './components/WeeklyForecast';
import MountainSelector from './components/MountainSelector';
import ForecastGraph from './components/ForecastGraph';
import MapComponent from './components/MapComponent';
import { mountains } from './data/mountains';
import { getRandomBackground } from './data/backgrounds';

function App() {
  const [selectedMountain, setSelectedMountain] = useState(mountains.find(m => m.name === '청계산') || mountains[0]);
  const [weather, setWeather] = useState(null);
  const [hourly, setHourly] = useState(null);
  const [daily, setDaily] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bgImage, setBgImage] = useState('');

  useEffect(() => {
    setBgImage(getRandomBackground());
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${selectedMountain.lat}&longitude=${selectedMountain.lng}&current=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weathercode,cloudcover,windspeed_10m&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&timezone=auto`
        );
        const data = await response.json();

        const currentData = {
          ...data.current,
          temperature: data.current.temperature_2m,
          windspeed: data.current.windspeed_10m,
          weathercode: data.current.weathercode,
          apparent_temperature: data.current.apparent_temperature,
          precipitation: data.current.precipitation
        };

        setWeather(currentData);
        setHourly(data.hourly);
        setDaily(data.daily);
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [selectedMountain]);

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed text-white overflow-y-auto lg:h-screen lg:overflow-hidden relative"
      style={{
        backgroundImage: `url(${bgImage})`
      }}
    >
      {/* Dark Overlay for contrast - Lighter than before */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>

      {/* Main Grid Container - Stack vertically on mobile, Grid on Desktop */}
      {/* Mobile: Flex Col, Desktop: 2x2 Grid */}
      <main className="relative z-10 w-full lg:h-full max-w-[1920px] mx-auto p-4 lg:p-6 flex flex-col gap-6 lg:grid lg:grid-cols-[2.2fr_1fr] lg:grid-rows-[5.5fr_4.5fr]">

        {/* === Top Left: Map === */}
        {/* Mobile: Fixed Height for Map, Desktop: Auto Fill */}
        <div className="glass-panel p-4 relative flex flex-col overflow-hidden h-[50vh] min-h-[400px] lg:h-auto lg:min-h-0">
          {/* Header inside Map Area - Aligned with other panels (p-6 = 24px) */}
          <div className="absolute top-6 left-6 right-6 z-[400] flex justify-between items-start pointer-events-none">
            <div className="pointer-events-auto min-w-[200px] w-full max-w-[280px]"> {/* Responsive Width */}
              <MountainSelector
                selectedMountain={selectedMountain}
                onSelectMountain={setSelectedMountain}
              />
            </div>
          </div>

          <div className="w-full h-full rounded-[16px] overflow-hidden relative z-0">
            <MapComponent
              selectedMountain={selectedMountain}
              mountains={mountains}
              onSelectMountain={setSelectedMountain}
            />
          </div>
        </div>

        {/* === Top Right: Merged Weather Info === */}
        <div className="min-h-0 w-full">
          <CurrentWeatherPanel
            weather={weather}
            daily={daily}
            mountainName={selectedMountain.name}
          />
        </div>

        {/* === Bottom Left: Forecast Graph === */}
        {/* Mobile: Fixed Height for Graph, Desktop: Auto Fill */}
        <div className="glass-panel p-2 lg:p-4 overflow-hidden flex flex-col relative h-[300px] lg:h-auto lg:min-h-0 w-full">
          {/* Graph Title styled nicely for glass */}
          <ForecastGraph hourly={hourly} daily={daily} />
        </div>

        {/* === Bottom Right: Weekly Forecast === */}
        <div className="min-h-0 w-full">
          <WeeklyForecast daily={daily} />
        </div>

      </main>
    </div>
  );
}

export default App;
