import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with bundlers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to update map view when selected mountain changes
const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, zoom, {
            duration: 1.5
        });
    }, [center, zoom, map]);
    return null;
};

const MapComponent = ({ selectedMountain, mountains, onSelectMountain }) => {
    const position = [selectedMountain.lat, selectedMountain.lng];

    return (
        <div className="h-full w-full rounded-xl overflow-hidden shadow-lg border border-white/30 relative z-0">
            <MapContainer
                center={position}
                zoom={13}
                scrollWheelZoom={true} // Enabled scroll zoom
                style={{ height: '100%', width: '100%' }}
            >
                <ChangeView center={position} zoom={13} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Render markers for all mountains if list is provided */}
                {mountains && mountains.map((mountain) => (
                    <Marker
                        key={mountain.id}
                        position={[mountain.lat, mountain.lng]}
                        eventHandlers={{
                            click: () => onSelectMountain && onSelectMountain(mountain),
                        }}
                        opacity={selectedMountain.id === mountain.id ? 1 : 0.7} // Highlight selected
                    >
                        <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                            {mountain.name}
                        </Tooltip>
                        {selectedMountain.id === mountain.id && (
                            <Popup>
                                <div className="text-center">
                                    <strong className="text-lg">{mountain.name}</strong><br />
                                    {mountain.height}<br />
                                    {mountain.location}
                                </div>
                            </Popup>
                        )}
                    </Marker>
                ))}

                {/* Fallback for single marker if mountains prop is missing (though it shouldn't be) */}
                {!mountains && (
                    <Marker position={position}>
                        <Popup>
                            <div className="text-center">
                                <strong className="text-lg">{selectedMountain.name}</strong><br />
                                {selectedMountain.height}<br />
                                {selectedMountain.location}
                            </div>
                        </Popup>
                    </Marker>
                )}

            </MapContainer>
        </div>
    );
};

export default MapComponent;
