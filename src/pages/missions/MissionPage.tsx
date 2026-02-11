import GameLayout from '@/components/layouts/GameLayout';

const MissionPage = () => {
  return (
    <GameLayout>
      <div className="min-h-screen p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Mission Hub</h1>
          <p className="text-emerald-200">Interactive missions coming soon...</p>
        </div>
      </div>
    </GameLayout>
  );
};

export default MissionPage;
