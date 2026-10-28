import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router';
import api from '../api/axios';
import { useUserLocation } from '../hooks/useUserLocation';

const CATEGORIES = ['mason', 'plumber', 'carpenter', 'helper', 'electrician', 'construction'];

function PostJob() {
    const navigate = useNavigate();
    const { coords, loading: locLoading, error: locError, refreshLocation } = useUserLocation();

    const [form, setform] = useState({
        title: "",
        category: CATEGORIES[0],
        wagesPerDay: "",
        workersNeeded: "",
        durationDays: "",
        employerName: "",
        phone: "",
        address: ""
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const labelMap = {
        title: "Job Title",
        category: "Category",
        wagesPerDay: "Daily Wage (₹ / Day)",
        workersNeeded: "Workers Needed",
        durationDays: "Duration (Days)",
        employerName: "Employer / Contractor Name",
        phone: "Phone Number (10 Digits)",
        address: "Worksite Address"
    };

    // form ki state ko update krne ke liye
    const handleChange = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError("");

        // 1. Validation: Location check
        if (!coords.latitude || !coords.longitude) {
            setSubmitError("Please capture the worksite location before publishing.");
            return;
        }

        // 2. Prepare GeoJSON payload (MongoDB expects [longitude, latitude])
        const payload = {
            ...form,
            wagesPerDay: Number(form.wagesPerDay),
            workersNeeded: Number(form.workersNeeded),
            durationDays: Number(form.durationDays),
            location: {
                type: "Point",
                coordinates: [coords.longitude, coords.latitude]
            }
        };

        // console.log("backend ko kya bhej rhe hain: ", payload);

        try {
            setSubmitting(true);
            await api.post("/jobs/create", payload);
            alert("Job Created Successfully!");
            navigate('/');
        } catch (error) {
            console.error("Error in Adding Job");
            setSubmitError(error.response?.data?.message || "Failed to post job. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm max-w-md mx-auto">
            <h2 className="text-xl font-black text-slate-900 mb-1">Post a New Job</h2>
            <p className="text-xs text-slate-500 mb-4">Connect instantly with nearby skilled workers and laborers.</p>

            {/* --- Location Capture Status --- */}
            <div className='p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 text-xs'>
                <div className='flex justify-between items-center mb-1'>
                    <span font-bold text-slate-700>Site Location (GPS): </span>
                    {coords.latitude ? (
                        < span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Captured
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={refreshLocation}
                            className="text-amber-700 font-bold underline cursor-pointer"
                        >
                            Detect Location
                        </button>
                    )}
                </div>
                {locLoading && <p className="text-slate-500">Detecting current location...</p>}
                {locError && <p className="text-red-600">{locError}</p>}
                {coords.latitude && (
                    <p className="font-mono text-slate-400 text-[11px]">
                        {coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}
                    </p>
                )}
            </div>

            {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs mb-4">
                    ⚠️ {submitError}
                </div>
            )}

            {/* --- Main Form --- */}
            <form onSubmit={handleSubmit} className="space-y-3">
                {Object.keys(form).map((key) => {
                    // Select dropdown for Category
                    if (key === 'category') {
                        return (
                            <div key={key}>
                                <label htmlFor={key} className="block text-xs font-bold text-slate-700 mb-1">
                                    {labelMap[key]}
                                </label>
                                <select
                                    id={key}
                                    name={key}
                                    value={form[key]}
                                    onChange={handleChange}
                                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 capitalize"
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option
                                            key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        );
                    }

                    // Standard inputs for numerical and text values
                    return (
                        <div key={key}>
                            <label htmlFor={key} className="block text-xs font-bold text-slate-700 mb-1">
                                {labelMap[key]}
                            </label>
                            <input
                                id={key}
                                name={key}
                                value={form[key]}
                                onChange={handleChange}
                                required
                                type={
                                    key === 'wagesPerDay' || key === 'workersNeeded' || key === 'durationDays'
                                        ? 'number'
                                        : key === 'phone'
                                            ? 'tel'
                                            : 'text'
                                }
                                placeholder={`Enter ${labelMap[key]}`}
                                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    );
                })}

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-4 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl text-sm transition cursor-pointer"
                >
                    {submitting ? "Publishing Job..." : "Publish Job Requirement"}
                </button>
            </form>
        </div>
    );
}

export default PostJob;