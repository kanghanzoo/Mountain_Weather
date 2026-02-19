import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Custom icons
const createMountainIcon = (type) => {
    const isPlus = type === 'plus';
    const emoji = isPlus ? '🏔️' : '⛰️'; // Snow capped for Plus, Standard for 100

    // 명산 100 (Standard): Natural Green look (Default emoji colors are usually brownish/green)
    // 명산 100+ (Plus): Icy Blue look
    // Using filter to shift colors distinctively
    const filterStyle = isPlus
        ? 'filter: hue-rotate(180deg) brightness(1.2) drop-shadow(0 2px 3px rgba(0, 200, 255, 0.6));' // Blue tint & Azure glow
        : 'filter: drop-shadow(0 2px 3px rgba(0, 100, 0, 0.5));'; // Greenish shadow

    return L.divIcon({
        html: `<div style="font-size: 28px; line-height: 1; ${filterStyle} transition: transform 0.2s;">${emoji}</div>`,
        className: 'custom-div-icon',
        iconSize: [28, 28], // Slightly larger
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
    });
};

const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 11, {
                animate: true,
                duration: 1.5
            });
        }
    }, [center, map]);
    return null;
};

const MapComponent = ({ mountains, selectedMountain, onSelectMountain }) => {
    return (
        <MapContainer
            center={[36.5, 127.5]}
            zoom={7}
            className="w-full h-full"
            zoomControl={false}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            <MapUpdater center={selectedMountain ? [selectedMountain.lat, selectedMountain.lng] : null} />

            {mountains.map(mountain => (
                <Marker
                    key={mountain.id}
                    position={[mountain.lat, mountain.lng]}
                    icon={createMountainIcon(mountain.type)}
                    eventHandlers={{
                        click: () => onSelectMountain(mountain),
                    }}
                >
                    <Popup
                        closeButton={false}
                        className="custom-popup"
                        autoPan={false}
                    >
                        <div className="text-center">
                            <div className="font-bold text-lg mb-1">{mountain.name}</div>
                            <div className="text-gray-500 text-sm">{mountain.height} | {mountain.location}</div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
