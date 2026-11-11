import { useState, useEffect } from 'react';
import { WindowState } from '../types';

interface TaskbarProps {
  windows: WindowState[];
  allWindows: WindowState[];
  onRestore: (id: string) => void;
  onMinimize: (id: string) => void;
}

export function Taskbar({ allWindows, onRestore, onMinimize }: TaskbarProps) {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    const timer = setInterval(() => setTime(new Date()), 1000);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(timer);
    };
  }, []);

  const activeWindows = allWindows;
  const itemCount = activeWindows.length;

  // Dynamic width: taskbar grows/shrinks with number of items
  // Fixed elements take ~220px (start button + tray)
  const fixedWidth = 220;
  const availableForItems = screenWidth - fixedWidth;
  const itemWidth = itemCount > 0
    ? Math.min(160, Math.max(90, Math.floor(availableForItems / itemCount) - 4))
    : 0;
  const totalItemsWidth = itemCount * (itemWidth + 4);

  return (
    <div className="h-12 bg-gradient-to-r from-gray-800 via-gray-750 to-gray-800 border-t border-gray-600 flex items-center px-2 shrink-0 relative">
      {/* Start Button */}
      <button className="h-9 px-3 bg-gradient-to-b from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 rounded-md text-white text-xs font-bold flex items-center gap-1.5 mr-2 border border-purple-500/50 shadow-md transition-all active:scale-95 shrink-0">
        <span className="text-base">🍓</span>
        <span className="hidden sm:inline">ZigWM</span>
      </button>

      {/* Separator */}
      <div className="w-px h-7 bg-gray-600 mx-1 shrink-0"></div>

      {/* Dynamic Taskbar Items Container */}
      <div
        className="flex items-center gap-1 transition-all duration-500 ease-in-out overflow-hidden"
        style={{
          width: `${totalItemsWidth}px`,
          maxWidth: `${availableForItems - 40}px`,
        }}
      >
        {activeWindows.map((win) => {
          const isActive = !win.minimized;
          return (
            <button
              key={win.id}
              onClick={() => {
                if (win.minimized) {
                  onRestore(win.id);
                } else {
                  onMinimize(win.id);
                }
              }}
              className={`h-9 flex items-center gap-1.5 px-2 rounded text-xs font-mono transition-all duration-300 border shrink-0 ${
                isActive
                  ? 'bg-gray-600/80 border-gray-500 text-white shadow-inner'
                  : 'bg-gray-700/50 border-gray-600/50 text-gray-400 hover:bg-gray-600/50'
              }`}
              style={{ width: `${itemWidth}px`, minWidth: '80px' }}
              title={win.title}
            >
              <span className="text-sm shrink-0">{win.icon}</span>
              <span className="truncate text-left flex-1">{win.title.split('—')[0].trim()}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Width Indicator */}
      <div className="mx-2 text-[10px] text-gray-500 font-mono shrink-0 hidden lg:block">
        [{totalItemsWidth}px]
      </div>

      {/* Spacer - shows available space */}
      <div className="flex-1"></div>

      {/* System Tray */}
      <div className="flex items-center gap-2 text-gray-400 text-xs font-mono shrink-0">
        <span className="hidden md:flex items-center gap-1" title="CPU Usage">
          <span className="text-green-400">⚡</span>
          <span>23%</span>
        </span>
        <span className="hidden md:flex items-center gap-1" title="Memory">
          <span className="text-yellow-400">💾</span>
          <span>45%</span>
        </span>
        <span className="hidden md:flex items-center gap-1" title="Temperature">
          <span className="text-orange-400">🌡️</span>
          <span>42°C</span>
        </span>
        <div className="w-px h-5 bg-gray-600 mx-1"></div>
        <span className="text-gray-300">
          {time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
