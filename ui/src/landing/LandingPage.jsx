import { useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Stakeholders from './Stakeholders';
import BlogCards from './BlogCards';

export default function LandingPage({ onSelectBlog }) {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <Hero />
      <Stakeholders 
        activeFilter={activeFilter} 
        setActiveFilter={setActiveFilter} 
      />
      <BlogCards 
        category={activeFilter}
        onSelectBlog={onSelectBlog} 
      />
    </div>
  );
}