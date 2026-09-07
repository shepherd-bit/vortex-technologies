
import { motion } from 'framer-motion';

export default function Stakeholders({ activeFilter, setActiveFilter, counts = { all: 0, investors: 0, regulators: 0, public: 0 } }) {
  const filters = [
    { id: 'all', label: 'All Updates', count: counts.all },
    { id: 'investors', label: 'For Investors', count: counts.investors },
    { id: 'regulators', label: 'For Regulators', count: counts.regulators },
    { id: 'public', label: 'For Public', count: counts.public },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-center items-center border-b border-neutral-300 shadow-xl bg-white rounded-2xl my-4"
    >
      {/* Centered Filter Buttons Strip */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 shadow-md border-2 ${
                isActive
                  ? 'bg-black text-white border-black shadow-lg'
                  : 'bg-white text-neutral-800 border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50'
              }`}
            >
              <span>{filter.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                  isActive ? 'bg-neutral-800 text-neutral-200 border-neutral-700' : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                }`}
              >
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}