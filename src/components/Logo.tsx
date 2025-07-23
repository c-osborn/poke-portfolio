'use client';

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

export default function Logo({ className = '', onClick }: LogoProps) {
  return (
    <div 
      className={`flex items-center space-x-4 cursor-pointer p-4 ${onClick ? 'hover:scale-105 transition-transform duration-200' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Modern Pokéball Icon */}
      <div className="relative">
        {/* Main Pokéball Container */}
        <div className="w-14 h-14 relative rounded-full shadow-xl">
          {/* Outer ring for depth */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
          
          {/* Main Pokéball */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
            {/* Top Half - Red with gradient */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-red-500 via-red-600 to-red-700 rounded-t-full"></div>
            
            {/* Bottom Half - White with subtle gradient */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-b from-gray-50 to-white rounded-b-full"></div>
            
            {/* Center Band */}
            <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gradient-to-r from-gray-700 to-gray-800 transform -translate-y-1/2 shadow-sm"></div>
            
            {/* Center Button */}
            <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-gradient-to-br from-gray-100 to-white border-2 border-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-inner">
              <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
            
            {/* Shine Effect */}
            <div className="absolute top-2 left-2 w-4 h-4 bg-white opacity-40 rounded-full blur-sm"></div>
          </div>
        </div>
        
        {/* Sparkles - More visible */}
        <div className="absolute -top-1 left-3 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-sparkle-1 shadow-sm"></div>
        <div className="absolute top-2 -right-1 w-1 h-1 bg-blue-300 rounded-full animate-sparkle-2 shadow-sm"></div>
        <div className="absolute -bottom-1 left-2 w-1.5 h-1.5 bg-red-300 rounded-full animate-sparkle-3 shadow-sm"></div>
        <div className="absolute top-1 -left-1 w-1 h-1 bg-green-300 rounded-full animate-sparkle-1 shadow-sm"></div>
        <div className="absolute -top-1 right-2 w-1.5 h-1.5 bg-purple-300 rounded-full animate-sparkle-2 shadow-sm"></div>
        <div className="absolute bottom-1 -right-1 w-1 h-1 bg-orange-300 rounded-full animate-sparkle-3 shadow-sm"></div>
        <div className="absolute -bottom-1 right-1 w-1.5 h-1.5 bg-pink-300 rounded-full animate-sparkle-1 shadow-sm"></div>
        <div className="absolute top-4 left-1 w-1 h-1 bg-cyan-300 rounded-full animate-sparkle-2 shadow-sm"></div>
      </div>
      
      {/* Modern Typography - Theme-aware text */}
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-black text-theme-primary animate-text-glow">
          Poké
        </span>
        <span className="text-2xl font-black text-theme-primary animate-text-glow-delayed">
          Portfolio
        </span>
      </div>
    </div>
  );
} 