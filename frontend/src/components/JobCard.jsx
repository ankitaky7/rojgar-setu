import React from 'react';

export const JobCard = ({ job }) => {
  // WhatsApp prefilled message
 const whatsappMsg = encodeURIComponent(
  `Hello ${job.employerName}, I came across your job post on RojgarSetu: "${job.title}". Is this position still open?`
);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      {/* Category & Wages */}
      <div className="flex justify-between items-start gap-2">
        <div>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase tracking-wide">
            {job.category}
          </span>
          <h3 className="font-bold text-slate-900 text-base mt-1.5 leading-snug">
            {job.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span>📍</span> {job.address}
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xl font-black text-emerald-600">₹{job.wagesPerDay}</span>
          <span className="text-xs text-slate-400 block font-medium">/ day</span>
        </div>
      </div>

      {/* Meta info */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <span>Needed: <strong className="text-slate-800">{job.workersNeeded} person</strong></span>
        <span>Contractor: <strong className="text-slate-800">{job.employerName}</strong></span>
      </div>

      {/* Call & WhatsApp Actions */}
      <div className="mt-3.5 grid grid-cols-2 gap-2">
        <a
          href={`tel:${job.phone}`}
          className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition"
        >
          <span>📞</span> Call Karein
        </a>

        <a
          href={`https://wa.me/91${job.phone}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition"
        >
          <span>💬</span> WhatsApp
        </a>
      </div>
    </div>
  );
};