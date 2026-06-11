import React, { useState, useEffect } from 'react';
import { Dumbbell, Anchor } from 'lucide-react';

const PLATES = [
  { id: 0, weight: '20 KG', name: 'Featherweight' },
  { id: 1, weight: '40 KG', name: 'Athletic Start' },
  { id: 2, weight: '60 KG', name: 'Metabolic Base' },
  { id: 3, weight: '80 KG', name: 'Power Zone' },
  { id: 4, weight: '100 KG', name: 'Aura Titan' },
  { id: 5, weight: '120 KG', name: 'Iron Will' },
  { id: 6, weight: '140 KG', name: 'Hypertrophy' },
  { id: 7, weight: '160 KG', name: 'Beast Core' },
  { id: 8, weight: '180 KG', name: 'Elite Level' },
  { id: 9, weight: '200 KG', name: 'Sovereign Force' },
];

export default function GymScrollProgress() {
  const [percent, setPercent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const total = scrollHeight - clientHeight;
      const currentPercent = total > 0 ? (window.scrollY / total) * 100 : 0;
      setPercent(currentPercent);

      // Simple entry animation fade-in after first scroll
      if (window.scrollY > 80) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once at start to capture reload state
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine active plate index in the 10-plate stack (0 to 9)
  const activePlateIndex = Math.min(Math.floor(percent / 10), 9);
  
  // Calculate total bar workload based on scroll progress (starting at 20kg bar, maxing at 220kg)
  const currentWorkload = Math.round(20 + (percent / 100) * 200);

  // High-performance dynamic bumper plate logic for the mobile Barbell
  // Plates load symmetrically: Red (25kg), Blue (20kg), Yellow (15kg), Green (10kg), White (5kg)
  const showRed = percent >= 80;
  const showBlue = percent >= 60;
  const showYellow = percent >= 40;
  const showGreen = percent >= 20;
  const showWhite = percent >= 5;

  return (
    <>
      {/* 1. MOBILE: Loaded Barbell Header Extension */}
      <div 
        id="mobile-barbell-scroller"
        className="fixed top-20 left-0 right-0 z-50 md:hidden h-[24px] bg-[#0c0c10]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 transition-all duration-300"
        style={{
          transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? 'auto' : 'none'
        }}
      >
        <div className="flex items-center space-x-1">
          <Dumbbell className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
          <span className="text-[9px] font-mono font-bold tracking-tight text-neutral-400">LOAD:</span>
          <span className="text-[10px] font-mono font-black text-orange-500 tracking-tighter">{currentWorkload} KG</span>
        </div>

        {/* Tactical Barbell Track */}
        <div className="flex-1 max-w-[180px] mx-2 h-4 relative flex items-center justify-center">
          {/* Steel main bar shaft */}
          <div className="absolute w-full h-[3px] bg-gradient-to-r from-neutral-700 via-neutral-300 to-neutral-700 rounded-full" />
          
          {/* Outer collars */}
          <div className="absolute left-[20px] w-1.5 h-3 bg-neutral-600 border border-neutral-400 rounded-sm" />
          <div className="absolute right-[20px] w-1.5 h-3 bg-neutral-600 border border-neutral-400 rounded-sm" />

          {/* Plates Loading Zone (Symmetrical LEFT) */}
          <div className="absolute right-[50%] mr-2 flex flex-row-reverse items-center gap-[2px] transition-all duration-300">
            {showRed && <div className="w-1.5 h-4 bg-red-600 border border-red-500 rounded-sm animate-scale-up" title="25kg Plate" />}
            {showBlue && <div className="w-1.5 h-3.5 bg-blue-600 border border-blue-500 rounded-sm animate-scale-up" title="20kg Plate" />}
            {showYellow && <div className="w-1.5 h-3 bg-yellow-500 border border-yellow-400 rounded-sm animate-scale-up" title="15kg Plate" />}
            {showGreen && <div className="w-1.5 h-2.5 bg-green-600 border border-green-500 rounded-sm animate-scale-up" title="10kg Plate" />}
            {showWhite && <div className="w-1.5 h-2 bg-neutral-300 border border-white rounded-sm animate-scale-up" title="5kg Plate" />}
          </div>

          {/* Plates Loading Zone (Symmetrical RIGHT) */}
          <div className="absolute left-[50%] ml-2 flex flex-row items-center gap-[2px] transition-all duration-300">
            {showWhite && <div className="w-1.5 h-2 bg-neutral-300 border border-white rounded-sm animate-scale-up" />}
            {showGreen && <div className="w-1.5 h-2.5 bg-green-600 border border-green-500 rounded-sm animate-scale-up" />}
            {showYellow && <div className="w-1.5 h-3 bg-yellow-500 border border-yellow-400 rounded-sm animate-scale-up" />}
            {showBlue && <div className="w-1.5 h-3.5 bg-blue-600 border border-blue-500 rounded-sm animate-scale-up" />}
            {showRed && <div className="w-1.5 h-4 bg-red-600 border border-red-500 rounded-sm animate-scale-up" />}
          </div>
        </div>

        <span className="text-[9px] font-mono font-bold text-neutral-400">{Math.round(percent)}%</span>
      </div>


      {/* 2. DESKTOP: Floating Cable Over Weight Stack Pulley Column */}
      <div 
        id="desktop-pulley-progress"
        className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col items-center select-none filter drop-shadow-2xl transition-all duration-500"
        style={{
          transform: isVisible ? 'translateY(-50%) scale(1)' : 'translateY(-50%) scale(0.9)',
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? 'auto' : 'none'
        }}
      >
        {/* Steel Cable Pulley Top Wheel Bracket */}
        <div className="w-16 h-10 bg-gradient-to-b from-[#1b1b22] to-neutral-900 border border-white/10 rounded-t-xl flex flex-col items-center justify-end pb-1 relative shadow-inner">
          <div className="w-7 h-7 rounded-full bg-neutral-800 border-2 border-neutral-600 flex items-center justify-center animate-spin-slow">
            <div className="w-3.5 h-3.5 rounded-full border border-orange-500/50 bg-[#ff5e00]/10 flex items-center justify-center">
              <div className="w-1 h-1 bg-orange-500 rounded-full" />
            </div>
          </div>
          <span className="text-[7px] font-mono tracking-widest text-[#ff5e00] opacity-80 uppercase scale-90 mb-0.5">AURA CABLE</span>
        </div>

        {/* Heavy Duty Weight Selector Guide Rails Container */}
        <div className="w-[84px] bg-[#0c0c10]/95 border-x border-b border-white/10 rounded-b-2xl p-2 relative flex flex-col gap-1 shadow-inner">
          
          {/* Floating Steel Guide Rails */}
          <div className="absolute left-[20px] top-0 bottom-4 w-[2px] bg-gradient-to-b from-neutral-600 via-neutral-400 to-neutral-700 pointer-events-none" />
          <div className="absolute right-[20px] top-0 bottom-4 w-[2px] bg-gradient-to-b from-neutral-600 via-neutral-400 to-neutral-750 pointer-events-none" />

          {/* Central Pulley Cable Line */}
          <div 
            className="absolute left-[50%] -translate-x-[50%] top-0 w-[1px] bg-orange-500 shadow-[0_0_8px_rgba(255,94,0,0.8)] pointer-events-none transition-all duration-300"
            style={{
              height: `${14 + activePlateIndex * 24}px`
            }}
          />

          {/* Weight plates stack wrapper */}
          <div className="flex flex-col gap-[3px] mt-2 relative z-10">
            {PLATES.map((plate) => {
              const isSelected = plate.id === activePlateIndex;
              const isLifted = plate.id <= activePlateIndex;
              
              return (
                <div
                  key={plate.id}
                  className="relative group cursor-help transition-all duration-300"
                  title={`${plate.name} - ${plate.weight}`}
                >
                  {/* Heavy Cast Iron Plate Block */}
                  <div 
                    className={`h-[18px] w-full rounded-[3px] flex items-center justify-between px-1.5 border relative shadow-md transition-all duration-500 ${
                      isSelected
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 border-orange-400 text-white translate-x-1 shadow-[0_0_12px_rgba(255,94,0,0.3)]'
                        : isLifted
                        ? 'bg-[#181820] border-orange-500/20 text-orange-400 -translate-y-[2px]'
                        : 'bg-[#0f0f13] border-white/5 text-neutral-500 hover:border-white/10 hover:bg-[#121218]'
                    }`}
                  >
                    {/* Tiny Center Pin Hole */}
                    <div className="absolute left-[50%] -translate-x-[50%] w-2 h-2 rounded-full bg-black/60 border border-white/5 flex items-center justify-center">
                      {isSelected && (
                        /* Selected Pin inserted */
                        <div className="w-1 h-3 rounded-full bg-orange-400 absolute left-[50%] -translate-x-[50%] animate-pulse z-20 shadow-[0_0_6px_rgba(255,100,0,1)]" />
                      )}
                    </div>

                    {/* Weight identifier badge left side only */}
                    <span className="text-[8px] font-mono font-bold tracking-tight select-none">
                      {plate.weight}
                    </span>

                    {/* Active dynamic pin visual pointer */}
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff5e00] animate-ping" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Workload Digital Gauge HUD */}
          <div className="mt-2.5 pt-2 border-t border-white/10 text-center relative z-10">
            <span className="text-[7px] font-mono uppercase tracking-widest text-neutral-500 block">TOTAL WORK</span>
            <div className="text-[12px] font-mono font-black text-orange-500 animate-rgb-glow tracking-tighter leading-none mt-1">
              {currentWorkload} KG
            </div>
            <div className="text-[6px] font-mono text-neutral-400 uppercase tracking-tight mt-0.5">
              {PLATES[activePlateIndex]?.name || 'Power State'}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
