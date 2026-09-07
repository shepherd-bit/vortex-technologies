import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
    <section className="relative overflow-hidden bg-[#FAFACA]/15 py-10 px-4 md:px-8 flex flex-col items-center justify-center min-h-[90vh]">
      
      {/* Main Hero Container spanning wider across the screen */}
      <div className="max-w-[90rem] mx-auto w-full relative flex flex-col items-center z-10 py-4">
        
        {/* Top Transparency Log */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-neutral-200 px-3 py-1 rounded-full text-xs text-neutral-600 mb-4 shadow-xs z-30"
        >
          <span className="w-2 h-2 rounded-full bg-black"></span>
          <span>TRANSPARENCY LOG • AUSTIN, TX • UPDATED 2 DAYS AGO</span>
        </motion.div>

        {/* Center-Aligned Main Section with Flanking Floating Cards */}
        <div className="w-full relative flex flex-col items-center justify-center min-h-[380px] my-2">
          
          {/* Left Side: Investor Memo Card (Locked Location) */}
          <div className="lg:absolute lg:left-4 lg:top-4 z-30 mb-6 lg:mb-0">
            {latestMemo && (
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0, y: [-4, 4, -4], rotate: [-2, -2, -2] }}
                transition={{ 
                  opacity: { duration: 0.6 },
                  x: { duration: 0.6 },
                  y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                }}
                className="bg-white p-4 rounded-2xl shadow-xl border border-neutral-100 w-72 transform -rotate-2 text-left"
              >
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
              </motion.div>
            )}
          </div>

          {/* Right Side: Drone Image Card (Locked Location) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, y: [-6, 6, -6] }}
            transition={{ 
              opacity: { duration: 0.8 },
              scale: { duration: 0.8 },
              y: { repeat: Infinity, duration: 6, ease: "easeInOut" } 
            }}
            className="lg:absolute lg:right-4 lg:-top-8 w-full max-w-sm pointer-events-none z-10 mb-6 lg:mb-0"
          >
            <div className="bg-[#F3EFE6] p-4 rounded-3xl shadow-xl border border-neutral-200/60 rotate-[4deg] transform pointer-events-auto">
              <div className="flex justify-end mb-2">
                <span className="bg-black text-white text-[10px] tracking-widest px-2 py-1 rounded font-mono uppercase">
                  Vortex X1 • Hover
                </span>
              </div>
              <div className="w-full h-48 flex items-center justify-center rounded-2xl overflow-hidden border border-dashed border-neutral-300 bg-neutral-100/50">
                <img src="./Fly-a-Drone.jpg" alt="Custom Hero Graphic" className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>

          {/* Center-Aligned Hero Text Content: Larger & Spread Across Screen */}
          <div className="max-w-4xl text-center relative z-20 flex flex-col items-center px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-neutral-900 leading-[1.1] mb-6 w-full"
            >
              <div>Building in public is a <span className="bg-[#ccff00] px-2.5 py-0.5 inline-block">feature</span>,</div>
              <div className="mt-2">not a bug</div>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-neutral-700 text-base md:text-lg leading-relaxed max-w-xl"
            >
              Texas-based UAS. Monthly notes, FAA filings, and raw dispatch logs straight from the CEO. No PR filter. For investors, regulators, and anyone who cares how drones get built in Austin.
            </motion.p>
          </div>

        </div>

        {/* Bottom Row: Center-Aligned CTAs & Locked Flight Hours Card */}
        <div className="w-full relative flex flex-col lg:flex-row items-center justify-between mt-6 z-30 px-4">
          
          {/* Center-Aligned CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center gap-4 mx-auto w-full lg:w-auto"
          >
            <button className="bg-black text-white px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-neutral-800 transition-colors cursor-pointer">
              Read latest &rarr;
            </button>
            <button className="bg-white border border-neutral-200 text-neutral-900 px-5 py-3 rounded-full text-sm font-medium shadow-xs cursor-pointer hover:bg-neutral-50 transition-colors">
              Vault ({vaultCount})
            </button>
          </motion.div>

          {/* Flight Hours Card (Locked Location on Right) */}
          <div className="lg:absolute lg:right-4 lg:-top-4 mt-6 lg:mt-0 z-30">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, y: [4, -4, 4] }}
              transition={{ 
                opacity: { duration: 0.6, delay: 0.6 },
                scale: { duration: 0.6, delay: 0.6 },
                y: { repeat: Infinity, duration: 5, ease: "easeInOut" }
              }}
              className="bg-black text-white p-4 rounded-2xl shadow-2xl w-60 text-left"
            >
              <div className="flex items-center justify-between text-[10px] text-neutral-400 uppercase tracking-widest mb-1">
                <span>Flight Hrs</span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Live</span>
              </div>
              <div className="text-xl font-bold tracking-tight mb-1">$1.2M ARR</div>
              <div className="text-[11px] text-neutral-300 font-mono">+1,240 hrs • 47km test</div>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}