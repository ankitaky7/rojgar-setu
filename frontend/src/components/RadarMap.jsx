import React from 'react'
import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import api from '../api/axios';

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

export const RadarMap = ({ userCoords, locError, onRetry, selectedSkill = 'All' }) => {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);

    useEffect(() => {
        if (userCoords.latitude && userCoords.longitude) {
            fetchWorkers();
        }
    }, [userCoords]);

    const fetchWorkers = async () => {
        try {
            setLoading(true);
            const res = await api.get("/workers/nearby", {
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
        } finally {
            setLoading(false);
        }
    };

    // 1. Geolocation Error Guard
    if (locError) {
        return (
            <div className="w-full h-[400px] rounded-2xl border border-red-200 bg-red-50/60 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="text-2xl">📍</div>
                <div>
                    <h4 className="text-sm font-bold text-red-900">Location Access Required</h4>
                    <p className="text-xs text-red-600 mt-1 max-w-xs">{locError}</p>
                </div>
                <button
                    onClick={onRetry}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
                >
                    Enable & Retry Location
                </button>
            </div>
        );
    }

    // 2. Initial Location Fetching Spinner
    if (!userCoords?.latitude || !userCoords?.longitude) {
        return (
            <div className="w-full h-[400px] rounded-2xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-6 text-center space-y-2">
                <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-semibold text-slate-600">Acquiring current GPS coordinates...</p>
            </div>
        );
    }

    // 3. Client-side category filtering (Zero latency)
    const filteredWorkers = selectedSkill === 'All'
        ? workers
        : workers.filter(w => w.skill?.toLowerCase() === selectedSkill.toLowerCase());

    const userCenter = [userCoords.latitude, userCoords.longitude];

    return (
        <div className='relative w-full h-[400px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100'>
            {/* Top Overlay Status Badge */}
            <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm border border-slate-200/80 text-slate-800 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                <span>
                    {loading
                        ? "Scanning radar..."
                        : `${filteredWorkers.length} Worker${filteredWorkers.length === 1 ? '' : 's'} Available (${selectedSkill})`}
                </span>
            </div>

            <MapContainer
                center={userCenter}
                zoom={14}
                scrollWheelZoom={true}
                className='w-full h-full'
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Employer Current Location Marker */}
                <Marker
                    position={userCenter}
                    icon={createCustomIcon("📍 You", "#2563eb")}
                >
                    <Popup>Your Current Location</Popup>
                </Marker>

                {/* 5 km Radial Perimeter */}
                <Circle
                    center={userCenter}
                    radius={5000}
                    pathOptions={{
                        color: '#2563eb',
                        fillColor: '#3b82f6',
                        fillOpacity: 0.08,
                        weight: 1.5,
                        dashArray: '4, 8'
                    }}
                />

                {/* Nearby Online Workers */}
                {filteredWorkers.map((worker) => {
                    const lat = worker.location.coordinates[1];
                    const lng = worker.location.coordinates[0];

                    return (
                        <Marker
                            key={worker._id}
                            position={[lat, lng]}
                            icon={createCustomIcon(`👷 ${worker.skill}`, "#d97706")}
                            eventHandlers={{
                                click: () => setSelectedWorker(worker)
                            }}
                        />
                    );
                })}
            </MapContainer>

            {/* Bottom Floating Card on Pin Click */}
            {selectedWorker && (
                <div className="absolute bottom-3 left-3 right-3 z-[1000] bg-white p-3.5 rounded-xl shadow-xl border border-slate-200 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">{selectedWorker.name}</h4>
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">
                                {selectedWorker.skill}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Rate: <strong className="text-emerald-700">₹{selectedWorker.expectedDailyWage}/day</strong>
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSelectedWorker(null)}
                            className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 font-bold"
                        >
                            ✕
                        </button>
                        <a
                            href={`tel:${selectedWorker.phone}`}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow"
                        >
                            📞 Call Now
                        </a>
                    </div>
                </div>
            )}

        </div>
    )
}
