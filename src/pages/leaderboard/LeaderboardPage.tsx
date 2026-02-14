import GameLayout from '@/components/layouts/GameLayout';

const LeaderboardPage = () => {
  return (
    <GameLayout>
      <div className="min-h-screen p-6">
        <div className="bg-blue-950/30 backdrop-blur-lg rounded-xl p-8 border border-blue-500/30 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Leaderboard</h1>
          <p className="text-blue-300">Global leaderboard coming soon...</p>
        </div>
      </div>
    </GameLayout>
  );
};

export default LeaderboardPage;
