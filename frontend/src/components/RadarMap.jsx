import React from 'react'
import { useState, useEffect } from 'react'

// Default Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom pin icons
const createCustomIcon = (label, bgColor) => {
    return L.divIcon({
        className: 'custom-map-pin',
        html: `<div style="background-color: ${bgColor}; color: white; padding: 4px 8px; border-radius: 12px; font-weight: bold; font-size: 11px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 2px solid white; display: inline-block;">${label}</div>`,
        iconSize: [40, 25],
        iconAnchor: [20, 12]
    });
};

export const RadarMap = ({ userCoords }) => {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);

    useEffect(() => {
        if (userCoords.latitude && userCoords.longitude){
            fetchWorkers();
        }
    }, [userCoords]);

    const fetchWorkers = async () => {
        try {
            setLoading(true);
            const res = await api.get(/workers/nearby, {
                params: {
                    latitude: userCoords.latitude,
                    longitude: userCoords.longitude,
                    radius: 10000, // 10 km
                    // skill: selectedSkill
                }
            });
            setSelectedWorker(res.data.data || []);

        } catch (error) {
            console.error("Error fetching nearby workers:", err);
        }finally{
            setLoading(false);
        }


    };

    return (
        <div>RadarMap</div>
    )
}
