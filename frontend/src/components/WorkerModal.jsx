import React from 'react'
import { useState } from 'react'
import api from '../api/axios'

export const WorkerModal = ({ isOpen, onClose, coords, onWorkerOnline }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        skill: 'Mason',
        expectedDailyWage: ''
    });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!coords.latitude || !coords.longitude) {
            setErrorMsg('Location access is required to register as a worker.');
            return;
        }

        try {
            setLoading(true);

            const res = await api.post('/workers/onboard', {
                ...formData,
                expectedDailyWage: Number(formData.expectedDailyWage),
                location: {
                    coordinates: [coords.longitude, coords.latitude]
                }
            });

            onWorkerOnline(res.data.worker);
            onClose();
        } catch (error) {
            setErrorMsg(error.response?.data?.message || "Failed to register worker profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-xl"
                >
                    &times;
                </button>

                <h2 className="text-lg font-black text-slate-900">Worker Registration</h2>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                    Register your details to become discoverable to nearby employers and contractors.
                </p>

                {errorMsg && (
                    <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label
                            htmlFor='fullNameInput'
                            className="text-xs font-semibold text-slate-600">
                            Full Name
                        </label>
                        <input
                            id='fullNameInput'
                            required
                            placeholder="e.g. Ramesh Kumar"
                            className="w-full border border-slate-200 p-2.5 rounded-lg text-sm mt-1 focus:outline-amber-600"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor='phoneNumberInput'
                            className="text-xs font-semibold text-slate-600">
                            Phone Number
                        </label>
                        <input
                            id='phoneNumberInput'
                            type="tel"
                            required
                            placeholder="10-digit mobile number"
                            className="w-full border border-slate-200 p-2.5 rounded-lg text-sm mt-1 focus:outline-amber-600"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-slate-600">Primary Skill</label>
                            <select
                                className="w-full border border-slate-200 p-2.5 rounded-lg text-sm mt-1 bg-white focus:outline-amber-600"
                                value={formData.skill}
                                onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                            >
                                <option value="Mason">Mason</option>
                                <option value="Plumber">Plumber</option>
                                <option value="Carpenter">Carpenter</option>
                                <option value="Electrician">Electrician</option>
                                <option value="Helper">Helper</option>
                                <option value="Construction">Construction</option>
                            </select>
                        </div>



                        <div>
                            <label className="text-xs font-semibold text-slate-600">Wage (₹ / Day)</label>
                            <input
                                type="number"
                                required
                                placeholder="e.g. 600"
                                className="w-full border border-slate-200 p-2.5 rounded-lg text-sm mt-1 focus:outline-amber-600"
                                value={formData.expectedDailyWage}
                                onChange={(e) => setFormData({ ...formData, expectedDailyWage: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-lg text-sm mt-3 transition disabled:opacity-50"
                    >
                        {loading ? "Registering Profile..." : "Go Online for Work 🟢"}
                    </button>
                </form>

            </div>

        </div>
    );
};