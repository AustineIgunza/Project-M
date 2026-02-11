import GameLayout from '@/components/layouts/GameLayout';

const LeaderboardPage = () => {
  return (
    <GameLayout>
      <div className="min-h-screen p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Leaderboard</h1>
          <p className="text-yellow-200">Global leaderboard coming soon...</p>
        </div>
      </div>
    </GameLayout>
  );
};

export default LeaderboardPage;
