import GameLayout from '@/components/layouts/GameLayout';

const MissionPage = () => {
  return (
    <GameLayout>
      <div className="min-h-screen p-6">
        <div className="bg-blue-950/30 backdrop-blur-lg rounded-xl p-8 border border-blue-500/30 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Mission Hub</h1>
          <p className="text-blue-300">Interactive missions coming soon...</p>
        </div>
      </div>
    </GameLayout>
  );
};

export default MissionPage;
