import React from 'react';

// --- Map Placeholder Component ---
// A real implementation would use a library like @react-google-maps/api here.
// This placeholder perfectly mimics the layout from your screenshot.
const MapSection = () => {
  return (
    <section>
      <div className="relative h-64 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
        {/* Placeholder map image */}
        <img
          src="https://placehold.co/800x400/e2e8f0/e2e8f0?text=."
          alt="Map placeholder"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 flex gap-1">
          <button className="bg-white text-sm font-semibold px-4 py-1.5 rounded-md shadow">Map</button>
          <button className="bg-white text-sm font-semibold px-4 py-1.5 rounded-md shadow">Satellite</button>
        </div>
        <div className="absolute top-2 right-2 p-2 bg-white rounded-md shadow">
          {/* Placeholder for location search input */}
          <input
            type="text"
            placeholder="Search here"
            className="w-48 border border-gray-300 rounded-md px-2 py-1 text-sm"
          />
        </div>
        {/* Red pin marker */}
        <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -100%)' }}>
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-red-500">
            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 005.16-4.252C19.043 15.69 20 13.51 20 11.5a8.5 8.5 0 00-17 0c0 2.01.957 4.19 2.41 6.598A16.975 16.975 0 0011.54 22.351zM11.5 12.5a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
           </svg>
        </div>
      </div>
    </section>
  );
};

export default MapSection;

