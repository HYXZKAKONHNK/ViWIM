interface DesktopProps {
  addWindow: (title: string, icon: string, content: string) => void;
  onShowInfo: () => void;
  onShowGPU: () => void;
}

const APPS = [
  { title: 'Terminal', icon: '🖥️', content: 'terminal' },
  { title: 'Text Editor — Tkinter', icon: '📝', content: 'texteditor' },
  { title: 'System Monitor', icon: '📊', content: 'sysmonitor' },
  { title: 'Settings — Tkinter', icon: '⚙️', content: 'settings' },
  { title: 'Calculator — Tkinter', icon: '🔢', content: 'calculator' },
  { title: 'File Manager — Tkinter', icon: '📁', content: 'filemanager' },
];

export function Desktop({ addWindow, onShowInfo, onShowGPU }: DesktopProps) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 overflow-hidden">
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      ></div>

      {/* Raspberry Pi Logo Watermark */}
      <div className="absolute bottom-16 right-8 text-white/5 text-9xl font-bold pointer-events-none select-none">
        🍓
      </div>

      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-3">
        {APPS.map((app) => (
          <button
            key={app.title}
            onDoubleClick={() => addWindow(app.title, app.icon, app.content)}
            className="flex flex-col items-center w-20 p-2 rounded-lg hover:bg-white/10 transition-colors group"
            title={`Double-click to open ${app.title}`}
          >
            <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">
              {app.icon}
            </span>
            <span className="text-[10px] text-white/80 text-center leading-tight font-mono">
              {app.title.split('—')[0].trim()}
            </span>
          </button>
        ))}

        {/* Info Button */}
        <button
          onClick={onShowInfo}
          className="flex flex-col items-center w-20 p-2 rounded-lg hover:bg-white/10 transition-colors group mt-4 border border-white/20"
        >
          <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">
            ℹ️
          </span>
          <span className="text-[10px] text-white/80 text-center leading-tight font-mono">
            About ZigWM
          </span>
        </button>

        {/* GPU Button */}
        <button
          onClick={onShowGPU}
          className="flex flex-col items-center w-20 p-2 rounded-lg hover:bg-white/10 transition-colors group border border-green-500/30 bg-green-900/20"
        >
          <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">
            🎮
          </span>
          <span className="text-[10px] text-green-300 text-center leading-tight font-mono">
            GPU & Memory
          </span>
        </button>
      </div>

      {/* Help Text */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/30 text-xs font-mono text-center pointer-events-none">
        <div>Double-click icons to open apps • Drag title bars to move windows</div>
        <div>Taskbar auto-resizes based on open windows</div>
      </div>
    </div>
  );
}
