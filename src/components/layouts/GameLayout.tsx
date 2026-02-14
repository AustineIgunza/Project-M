import { ReactNode } from 'react';

interface GameLayoutProps {
  children: ReactNode;
}

const GameLayout = ({ children }: GameLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Game Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-blue-500/10 rounded-full blur-md animate-bounce delay-500"></div>
        <div className="absolute bottom-24 left-24 w-24 h-24 bg-blue-400/10 rounded-full blur-lg animate-bounce delay-1000"></div>
        <div className="absolute bottom-16 right-20 w-18 h-18 bg-blue-500/10 rounded-full blur-md animate-bounce delay-1500"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen p-4">
        {children}
      </div>
    </div>
  );
};

export default GameLayout;
