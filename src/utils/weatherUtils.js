export const getWeatherIcon = (code) => {
    const codes = {
        0: { text: '맑음', icon: '☀️' },
        1: { text: '대체로 맑음', icon: '🌤️' },
        2: { text: '구름 조금', icon: '⛅' },
        3: { text: '흐림', icon: '☁️' },
        45: { text: '안개', icon: '🌫️' },
        48: { text: '안개', icon: '🌫️' },
        51: { text: '이슬비', icon: 'DRIZZLE' },
        53: { text: '이슬비', icon: 'DRIZZLE' },
        55: { text: '이슬비', icon: 'DRIZZLE' },
        61: { text: '비', icon: '🌧️' },
        63: { text: '비', icon: '🌧️' },
        65: { text: '비', icon: '🌧️' },
        71: { text: '눈', icon: '☃️' },
        73: { text: '눈', icon: '☃️' },
        75: { text: '눈', icon: '☃️' },
        77: { text: '눈발', icon: '❄️' },
        80: { text: '소나기', icon: '🌦️' },
        81: { text: '소나기', icon: '🌦️' },
        82: { text: '소나기', icon: '🌦️' },
        85: { text: '눈 소나기', icon: '🌨️' },
        86: { text: '눈 소나기', icon: '🌨️' },
        95: { text: '천둥번개', icon: '⚡' },
        96: { text: '천둥번개/우박', icon: '⛈️' },
        99: { text: '천둥번개/우박', icon: '⛈️' },
    };
    return codes[code] || { text: '알 수 없음', icon: '❓' };
};
