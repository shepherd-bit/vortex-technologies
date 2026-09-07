import Navbar from './Navbar';
import Hero from './Hero';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <Hero />
      {/* Add other landing sections here later (BlogCards, Footer, etc.) */}
    </div>
  );
}