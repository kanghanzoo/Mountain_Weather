export const calculateHikingIndex = (temp, windSpeed, precipitation, humidity) => {
    // Basic heuristic for Hiking Comfort Index
    // Score based on 0-100 (100 is best)

    let score = 100;

    // 1. Precipitation Penalty
    if (precipitation > 0) {
        if (precipitation > 5) score -= 50; // Heavy rain/snow
        else if (precipitation > 1) score -= 30; // Rain
        else score -= 15; // Drizzle
    }

    // 2. Wind Penalty (Strong wind is dangerous in mountains)
    if (windSpeed > 10) {
        if (windSpeed > 20) score -= 40; // Gale
        else score -= 20; // Strong breeze
    }

    // 3. Temperature Penalty (Too hot or too cold)
    if (temp > 30 || temp < -10) score -= 30;
    else if (temp > 25 || temp < 0) score -= 10;

    // 4. Humidity adjustment (Muggy weather)
    if (temp > 20 && humidity > 80) score -= 10;

    // Determine Label
    if (score >= 90) return { text: "매우 좋음", color: "text-blue-200", icon: "🌟" };
    if (score >= 70) return { text: "좋음", color: "text-green-200", icon: "" };
    if (score >= 50) return { text: "보통", color: "text-yellow-200", icon: "😐" };
    if (score >= 30) return { text: "나쁨", color: "text-orange-200", icon: "☁️" };
    return { text: "매우 나쁨(위험)", color: "text-red-300", icon: "🚫" };
};

export const getPrecipitationLabel = (val) => {
    if (val === 0) return "없음";
    return `${val}mm`;
};
