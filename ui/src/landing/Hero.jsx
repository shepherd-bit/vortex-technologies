import { useState, useEffect } from 'react';

export default function Hero() {
  const [latestMemo, setLatestMemo] = useState(null);
  const [vaultCount, setVaultCount] = useState(0);

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/memos');
        const data = await response.json();
        
        if (data.length > 0) {
          setLatestMemo(data[0]);
          setVaultCount(data.length);
        } else {
          setLatestMemo(null);
          setVaultCount(0);
        }
      } catch (err) {
        console.error('Error fetching memos:', err);
      }
    };

    fetchMemos();
  }, []);

  const handleDownload = (id) => {
    window.open(`http://localhost:5000/api/memos/download/${id}`, '_blank');
  };

  return (
    <section className="relative overflow-hidden bg-[#FAFACA]/20 py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 items-center gap-12">
        
        {/* Left Side: Floating Investor Memo Card & Content */}
        <div className="md:col-span-6 flex flex-col items-start z-10">
          
          {/* Dynamic Investor Memo Floating Card (Appears/Disappears based on state) */}
          {latestMemo && (
            <div className="bg-white p-4 rounded-2xl shadow-xl border border-neutral-100 w-72 mb-8 relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-neutral-500 text-xs">
                  <span className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center font-bold">📄</span>
                  <span>{latestMemo.quarter}</span>
                </div>
                <span className="bg-[#ccff00] text-black font-semibold text-[10px] px-2 py-0.5 rounded-md uppercase">PDF</span>
              </div>
              
              <h4 className="font-bold text-neutral-900 text-sm mb-3 truncate">{latestMemo.file_name}</h4>
              
              <div className="flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-100 pt-2">
                <span>{latestMemo.page_count} pages</span>
                <button 
                  onClick={() => handleDownload(latestMemo.id)}
                  className="bg-black text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Download
                </button>
              </div>
            </div>
          )}

          {/* Transparency Log Tag */}
          <div className="flex items-center gap-2 bg-white/80 border border-neutral-200 px-3 py-1 rounded-full text-xs text-neutral-600 mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-black"></span>
            <span>TRANSPARENCY LOG • AUSTIN, TX • UPDATED 2 DAYS AGO</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-900 leading-[1.1] mb-6">
            Building in public is a <span className="bg-[#ccff00] px-1">feature</span>, not a bug
          </h1>

          {/* Description */}
          <p className="text-neutral-600 text-sm md:text-base leading-relaxed mb-8 max-w-lg">
            Texas-based UAS. Monthly notes, FAA filings, and raw dispatch logs straight from the CEO. No PR filter. For investors, regulators, and anyone who cares how drones get built in Austin.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <button className="bg-black text-white px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-neutral-800 transition-colors">
              Read latest &rarr;
            </button>
            <button className="bg-white border border-neutral-200 text-neutral-900 px-5 py-3 rounded-full text-sm font-medium shadow-xs">
              Vault ({vaultCount})
            </button>
          </div>

        </div>

        {/* Right Side: Drone Image & Live Metrics Badge */}
        <div className="md:col-span-6 relative flex justify-center">
          <div className="bg-[#F3EFE6] p-8 rounded-3xl shadow-lg relative max-w-md w-full border border-neutral-200/60">
            <div className="absolute top-4 right-4 bg-black text-white text-[10px] tracking-widest px-2 py-1 rounded font-mono uppercase">
              Vortex X1 • Hover
            </div>
            
            {/* Drone Graphic Placeholder */}
            <div className="py-12 flex justify-center">
              <span className="text-6xl">🛸</span>
            </div>

            {/* Live Metrics Floating Badge */}
            <div className="absolute -bottom-6 left-6 bg-black text-white p-4 rounded-2xl shadow-xl w-60">
              <div className="flex items-center justify-between text-[10px] text-neutral-400 uppercase tracking-widest mb-1">
                <span>Flight Hrs</span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Live</span>
              </div>
              <div className="text-xl font-bold tracking-tight mb-1">$1.2M ARR</div>
              <div className="text-[11px] text-neutral-300 font-mono">+1,240 hrs • 47km test</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}