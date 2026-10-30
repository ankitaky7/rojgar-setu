import React from 'react'
import { useState } from 'react'
import api from '../api/axios'

export const WorkerDashboardStrip = ({ worker, onStatusChange }) => {
    const [isOnline, setIsOnline] = useState(worker?.isOnline ?? true);
    const [updating, setUpdating] = useState(false);

    const handleToggle = async () => {
        try {
            setUpdating(true);
            const newStatus = !isOnline;

            const res = await api.patch('/workers/toggle-status', {
                workerId: worker._id,
                isOnline: newStatus
            });

            setIsOnline(newStatus);

            // local storage sync
            const updatedWorker = { ...worker, isOnline: newStatus };
            localStorage.setItem('rojgar_worker', JSON.stringify(updatedWorker));

            if (onStatusChange) {
                onStatusChange(updatedWorker);
            }
        } catch (error) {
            console.error("Status update failed:", error);
            alert("Failed to change status. Please check your internet connection.");
        } finally {
            setUpdating(false);
        }
    }
    return (
        <div className={`p-4 rounded-2xl border transition-all ${isOnline
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-slate-100 border-slate-300'
            }`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-3.5 h-3.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                        }`} />
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">
                            {worker.name} ({worker.skill})
                        </h3>
                        <p className="text-xs text-slate-500">
                            Expected Wage: <span className="font-semibold text-slate-700">₹{worker.expectedDailyWage}/day</span>
                        </p>
                    </div>
                </div>

                {/* Toggle Button */}
                <button
                    onClick={handleToggle}
                    disabled={updating}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${isOnline
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-slate-700 hover:bg-slate-800 text-white'
                        }`}
                >
                    {updating ? (
                        'Updating...'
                    ) : isOnline ? (
                        <><span>Duty Active</span> 🟢</>
                    ) : (
                        <><span>Duty Offline</span> 🔴</>
                    )}
                </button>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>{isOnline ? "Nearby contractors can see your radar" : "You are currently hidden from search"}</span>
                <button
                    onClick={() => {
                        localStorage.removeItem('rojgar_worker');
                        window.location.reload();
                    }}
                    className="text-red-500 hover:underline"
                >
                    Exit Worker Mode
                </button>
            </div>
        </div>
    )
}
