import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full bg-[#FAFAFA] border-b border-neutral-200/80 px-6 py-4 sticky top-0 z-50 shadow-[0_14px_30px_rgba(0,0,0,0.12)]"
    >
      {/* Centered container with max width, pulling outer items slightly inward */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-12">
        {/* Left Section: Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs tracking-wider">
            T
          </div>
          <span className="text-xs md:text-sm font-semibold tracking-widest text-neutral-900 uppercase">
            TITUS O. — CEO JOURNAL • AUSTIN, TX
          </span>
        </div>

        {/* Center Section: Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          <a href="#updates" className="hover:text-black transition-colors">Updates</a>
          <a href="#documents" className="hover:text-black transition-colors">Documents</a>
          <a href="#letter" className="hover:text-black transition-colors">Letter</a>
          <a href="#about" className="hover:text-black transition-colors">About</a>
        </div>

        {/* Right Section: Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 bg-white shadow-xs text-xs font-medium text-neutral-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          <span className="tracking-wide">EST 2026 • AUSTIN, TX</span>
        </div>
      </div>
    </motion.nav>
  );
}