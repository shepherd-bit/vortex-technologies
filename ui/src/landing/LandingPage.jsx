import { useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Stakeholders from './Stakeholders';

export default function LandingPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <Hero />
      <Stakeholders 
        activeFilter={activeFilter} 
        setActiveFilter={setActiveFilter} 
      />
      {/* Add other landing sections here later (BlogCards, Footer, etc.) */}
    </div>
  );
}