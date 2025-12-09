import React from 'react';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy-900 text-white">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full border-4 border-gold-500/30 animate-ping absolute top-0 left-0"></div>
        <div className="w-24 h-24 bg-gold-500 rounded-full flex items-center justify-center relative shadow-xl shadow-gold-500/20 z-10 animate-bounce">
          <span className="text-4xl font-bold text-navy-900 font-display">S</span>
        </div>
      </div>
      
      <div className="text-center space-y-2 animate-pulse">
        <h1 className="text-3xl font-display font-bold tracking-wider">Savora</h1>
        <p className="text-gold-500 text-sm font-medium tracking-widest uppercase">Save Smart. Grow Together.</p>
      </div>

      <div className="absolute bottom-10 w-48 h-1 bg-navy-800 rounded-full overflow-hidden">
        <div className="h-full bg-gold-500 animate-[loading_2s_ease-in-out_infinite]"></div>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 50%; }
          100% { width: 100%; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;