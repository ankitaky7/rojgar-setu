import React from 'react'
import { useState, useEffect } from 'react'
import {WorkerModal} from './WorkerModal';
import {useUserLocation} from '../hooks/useUserLocation'
import { Link } from 'react-router';

function Navbar() {
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [currentWorker, setCurrentWorker] = useState(null);
  const { coords } = useUserLocation();

  // LocalStorage check karein agar worker pehle se login/register ho chuka hai
  useEffect(() => {
    const savedWorker = localStorage.getItem('rojgar_worker');
    if (savedWorker && savedWorker !== "undefined") {
      try {
        setCurrentWorker(JSON.parse(savedWorker));
      } catch (error) {
        console.error("Failed to parse saved worker", error);
      }
    }
  }, []);

  const handleWorkerOnline = (workerData) => {
    setCurrentWorker(workerData);
    localStorage.setItem('rojgar_worker', JSON.stringify(workerData))
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">

          {/* Logo / App Name */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-amber-600">
              Rojgar<span className="text-slate-900">Setu</span>
            </span>
          </Link>

          {/* Action Button */}
          <div className="flex items-center gap-7">
            <Link
              to="/post-job"
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-7 py-2 rounded-lg transition"
            >
              Post a Job +
            </Link>

            {/* I'm a Worker Button -> Ab ye Modal Open karega */}
            <button
              type="button"
              onClick={() => setIsWorkerModalOpen(true)}
              className={`text-xs font-bold px-7 py-2 rounded-lg transition ${currentWorker?.isOnline
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-green-700 hover:bg-green-900 text-white cursor-pointer'
                }`}
            >
              {currentWorker?.isOnline ? 'Online (Worker) 🟢' : "I'm a Worker"}
            </button>
          </div>
        </div>
      </header>

      {/* Modal yahin render hoga */}
      <div className='px-5 font-medium'>
      <WorkerModal
        isOpen={isWorkerModalOpen}
        onClose={() => setIsWorkerModalOpen(false)}
        coords={coords}
        onWorkerOnline={handleWorkerOnline}
      />
      </div>
    </>
  );
}

export default Navbar