import HeroAd from './HeroAd';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">Vortex CMS</h1>
          <p className="text-xs text-neutral-500">Manage investor memos and public site state</p>
        </header>

        <HeroAd />
      </div>
    </div>
  );
}