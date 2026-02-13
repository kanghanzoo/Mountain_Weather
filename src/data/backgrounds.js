export const backgroundImages = [
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=3870&auto=format&fit=crop", // Mountains with clouds
    "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=3876&auto=format&fit=crop", // Snowy peak
    "https://images.unsplash.com/photo-1486870591958-9b9d0ae1f703?q=80&w=3870&auto=format&fit=crop", // Green valley
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=3870&auto=format&fit=crop", // Starry night mountain
    "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=3876&auto=format&fit=crop", // Autumn mountain
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=2680&auto=format&fit=crop", // Dark moody mountain
    "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?q=80&w=3870&auto=format&fit=crop", // Sunset peak
    "https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=3559&auto=format&fit=crop", // Sunny valley
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=3870&auto=format&fit=crop", // Misty forest mountain
    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=3870&auto=format&fit=crop", // Alpine lake
];

export const getRandomBackground = () => {
    return backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
};
