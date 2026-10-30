import React from 'react'
import { useState, useEffect } from "react";

export const useUserLocation = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [coords, setCoords] = useState({ latitude: null, longitude: null });
    const fetchLocation = () => {
        // to check browser supports or not navigation object
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }
        setLoading(true);
        setError('');

        // find the location through browser using navigator object
        navigator.geolocation.getCurrentPosition((position) => {
            // success callback
            setCoords({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
            setLoading(false);
        },
            (err) => {
                setError("Location permission denied. Please allow location to see local jobs.");
                setLoading(false);
            },
            { 
                enableHighAccuracy: true, 
                timeout: 10000, 
                maximumAge: 60000        // 1 minute tak purani accurate location cache use karega (jump nahi hoga)
            }
        );
    };

    useEffect(() => {
        fetchLocation();
    }, []);

    return { coords, loading, error, refreshLocation: fetchLocation };
};