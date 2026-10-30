import React, { useState, useEffect } from 'react';
import api from '../api/axios'
import { useUserLocation } from '../hooks/useUserLocation';
import { JobCard } from '../components/JobCard';
import { WorkerDashboardStrip } from '../components/WorkerDashboardStrip';

const CATEGORIES = ['All', 'Mason', 'Plumber', 'Carpenter', 'Electrician', 'Helper', 'Construction'];

export default function Home() {
  const { coords, loading: locLoading, error: locError, refreshLocation } = useUserLocation();
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentWorker, setCurrentWorker] = useState(null);

  // Check if a worker profile is stored in localStorage
  useEffect(() => {
    const savedWorker = localStorage.getItem('rojgar_worker');
    if (savedWorker && savedWorker !== 'undefined') {
      try {
        setCurrentWorker(JSON.parse(savedWorker));
      } catch (error) {
        console.error("Failed to parse worker session", error);
        localStorage.removeItem('rojgar_worker');
      }
    }
  }, [])

  // Fetch nearby jobs
  useEffect(() => {
    if (coords.latitude && coords.longitude) {
      const getNearbyJobs = async () => {
        try {
          setJobsLoading(true);
          setJobsError('');
          const res = await api.get('/jobs/nearby', {
            params: {
              latitude: coords.latitude,
              longitude: coords.longitude,
              radius: 10000 // 10 km
            }
          });
          setJobs(res.data.data || []);
        } catch (err) {
          console.error("Backend fetch error:", err);
          setJobsError(err.response?.data?.message || 'Error in Loading Job.');
        } finally {
          setJobsLoading(false);
        }
      };

      getNearbyJobs();
    }
  }, [coords]);

  // Frontend category filtering
  const filteredJobs = selectedCategory === 'All'
    ? jobs
    : jobs.filter(j => j.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="space-y-4 pb-12">
      {/* 0. Worker Dashboard Strip (Agar worker profile active hai) */}
      {currentWorker && (
        <WorkerDashboardStrip
          worker={currentWorker}
          onStatusChange={(updatedWorker) => setCurrentWorker(updatedWorker)}
        />
      )}

      {/* 1. Location Status Strip */}
      <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
        {locLoading && (
          <div className="flex items-center justify-center gap-2 text-amber-600 text-xs py-1">
            <div className="w-3.5 h-3.5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            <span>We are currently verifying your location...</span>
          </div>
        )}

        {!locLoading && locError && (
          <div className="flex items-center justify-between text-xs text-red-600">
            <span>⚠️ {locError}</span>
            <button
              onClick={refreshLocation}
              className="bg-red-600 text-white px-2 py-1 rounded font-bold hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {!locLoading && !locError && coords.latitude && (
          <div className="flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Active within a 10 km radius.
              </span>
            </div>
            <span className="font-mono text-slate-400 text-[11px]">
              {coords.latitude.toFixed(3)}, {coords.longitude.toFixed(3)}
            </span>
          </div>
        )}
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs rounded-full font-bold whitespace-nowrap transition ${selectedCategory === cat
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. Jobs Feed */}
      <div>
        {jobsLoading && (
          <div className="text-center py-10 text-slate-500 text-xs">
            <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Finding Nearby Jobs...
          </div>
        )}

        {jobsError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
            {jobsError}
          </div>
        )}

        {!jobsLoading && !jobsError && coords.latitude && filteredJobs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
            <p className="font-bold text-slate-800 text-sm">No Jobs have been Found</p>
            <p className="text-xs text-slate-400 mt-1">
              No requirements found in this category near your location.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </div>

    </div>
  );
}