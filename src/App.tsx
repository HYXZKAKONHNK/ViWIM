import { useState, useCallback, useRef, useEffect } from 'react';
import { WindowState } from './types';
import { Window } from './components/Window';
import { Taskbar } from './components/Taskbar';
import { Desktop } from './components/Desktop';
import { ZigInfo } from './components/ZigInfo';
import { GPUPanel } from './components/GPUPanel';

const INITIAL_WINDOWS: WindowState[] = [
  {
    id: 'win-1',
    title: 'Python Calculator — Tkinter',
    x: 80,
    y: 60,
    width: 320,
    height: 280,
    minimized: false,
    maximized: false,
    zIndex: 1,
    icon: '🐍',
    content: 'calculator',
  },
  {
    id: 'win-2',
    title: 'File Manager — Tkinter',
    x: 200,
    y: 120,
    width: 380,
    height: 300,
    minimized: false,
    maximized: false,
    zIndex: 2,
    icon: '📁',
    content: 'filemanager',
  },
];

export default function App() {
  const [windows, setWindows] = useState<WindowState[]>(INITIAL_WINDOWS);
  const [nextZIndex, setNextZIndex] = useState(3);
  const [showInfo, setShowInfo] = useState(false);
  const [showGPU, setShowGPU] = useState(false);
  const dragRef = useRef<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const focusWindow = useCallback(
    (id: string) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, zIndex: nextZIndex } : w))
      );
      setNextZIndex((z) => z + 1);
    },
    [nextZIndex]
  );

  const startDrag = useCallback(
    (id: string, e: React.MouseEvent) => {
      const win = windows.find((w) => w.id === id);
      if (!win || win.maximized) return;
      focusWindow(id);
      dragRef.current = {
        id,
        offsetX: e.clientX - win.x,
        offsetY: e.clientY - win.y,
      };
    },
    [windows, focusWindow]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const { id, offsetX, offsetY } = dragRef.current;
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id
            ? { ...w, x: Math.max(0, e.clientX - offsetX), y: Math.max(0, e.clientY - offsetY) }
            : w
        )
      );
    };
    const handleMouseUp = () => {
      dragRef.current = null;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w))
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized) {
          return {
            ...w,
            maximized: false,
            x: w.prevBounds?.x ?? 100,
            y: w.prevBounds?.y ?? 60,
            width: w.prevBounds?.width ?? 400,
            height: w.prevBounds?.height ?? 300,
          };
        }
        return {
          ...w,
          maximized: true,
          prevBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight - 48,
        };
      })
    );
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: false } : w))
    );
    focusWindow(id);
  }, [focusWindow]);

  const addWindow = useCallback(
    (title: string, icon: string, content: string) => {
      const id = `win-${Date.now()}`;
      const newWin: WindowState = {
        id,
        title,
        x: 60 + Math.random() * 200,
        y: 40 + Math.random() * 150,
        width: 360,
        height: 280,
        minimized: false,
        maximized: false,
        zIndex: nextZIndex,
        icon,
        content,
      };
      setWindows((prev) => [...prev, newWin]);
      setNextZIndex((z) => z + 1);
    },
    [nextZIndex]
  );

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-gray-900 select-none">
      {/* Desktop Area */}
      <div className="flex-1 relative overflow-hidden">
        <Desktop addWindow={addWindow} onShowInfo={() => setShowInfo(true)} onShowGPU={() => setShowGPU(true)} />

        {/* Windows */}
        {windows.map(
          (win) =>
            !win.minimized && (
              <Window
                key={win.id}
                window={win}
                onFocus={focusWindow}
                onDragStart={startDrag}
                onClose={closeWindow}
                onMinimize={minimizeWindow}
                onMaximize={maximizeWindow}
              />
            )
        )}

        {/* Zig Info Panel */}
        {showInfo && <ZigInfo onClose={() => setShowInfo(false)} />}

        {/* GPU Panel */}
        {showGPU && <GPUPanel onClose={() => setShowGPU(false)} />}
      </div>

      {/* Taskbar */}
      <Taskbar
        windows={windows.filter((w) => !w.minimized)}
        allWindows={windows}
        onRestore={restoreWindow}
        onMinimize={minimizeWindow}
      />
    </div>
  );
}
