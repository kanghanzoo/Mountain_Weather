import { useState, useEffect } from 'react';
import WeatherCard from './components/WeatherCard';
import MountainSelector from './components/MountainSelector';
import HourlyForecast from './components/HourlyForecast';
import WeeklyForecast from './components/WeeklyForecast';
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

  // Set random background on mount
  useEffect(() => {
    setBgImage(getRandomBackground());
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${selectedMountain.lat}&longitude=${selectedMountain.lng}&current_weather=true&hourly=temperature_2m,weathercode,precipitation_probability&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
        );
        const data = await response.json();
        setWeather(data.current_weather);
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
      className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 flex flex-col items-center bg-cover bg-center bg-no-repeat bg-fixed transition-all duration-1000"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${bgImage})`
      }}
    >
      <header className="w-full max-w-6xl mx-auto mb-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-md mb-4 sm:mb-0">🏔️ 산 날씨 예보</h1>
        <div className="w-full sm:w-80">
          <MountainSelector
            selectedMountain={selectedMountain}
            onSelectMountain={setSelectedMountain}
          />
        </div>
      </header>

      {/* Rest of the component remains the same, but loading spinner needs to be white */}
      {loading ? (
        <div className="text-white text-xl mt-10 animate-pulse flex-1 flex items-center justify-center font-semibold drop-shadow-md">
          날씨 정보를 불러오는 중입니다...
        </div>
      ) : (
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl mx-auto flex-1">
          {/* Left Column: Weather Info */}
          <div className="space-y-6 order-2 lg:order-1">
            <WeatherCard weather={weather} mountainName={selectedMountain.name} />
            {hourly && <HourlyForecast hourly={hourly} />}
            {daily && <WeeklyForecast daily={daily} />}
          </div>

          {/* Right Column: Map */}
          <div className="order-1 lg:order-2 h-[300px] sm:h-[400px] lg:h-auto min-h-[300px] lg:min-h-[500px] sticky top-6">
            <MapComponent
              selectedMountain={selectedMountain}
              mountains={mountains}
              onSelectMountain={setSelectedMountain}
            />
          </div>
        </main>
      )}

      <footer className="mt-12 text-white/70 text-sm py-4 w-full text-center border-t border-white/20 backdrop-blur-sm">
        Data provided by Open-Meteo & OpenStreetMap | Developed with Vite + React
      </footer>
    </div>
  );
}

export default App;
