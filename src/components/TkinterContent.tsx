interface TkinterContentProps {
  type: string;
}

export function TkinterContent({ type }: TkinterContentProps) {
  switch (type) {
    case 'calculator':
      return <CalculatorContent />;
    case 'filemanager':
      return <FileManagerContent />;
    case 'terminal':
      return <TerminalContent />;
    case 'texteditor':
      return <TextEditorContent />;
    case 'settings':
      return <SettingsContent />;
    case 'sysmonitor':
      return <SysMonitorContent />;
    default:
      return <DefaultContent />;
  }
}

function CalculatorContent() {
  return (
    <div className="p-3 font-mono text-sm bg-gray-200 h-full">
      <div className="bg-white border border-gray-400 p-2 mb-3 text-right text-lg font-bold rounded">
        0
      </div>
      <div className="grid grid-cols-4 gap-1">
        {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map(
          (btn) => (
            <button
              key={btn}
              className="bg-gray-300 hover:bg-gray-400 border border-gray-400 py-2 rounded text-center text-sm font-bold active:bg-gray-500 transition-colors"
            >
              {btn}
            </button>
          )
        )}
      </div>
      <div className="mt-2 text-xs text-gray-500 text-center">
        # Tkinter Calculator v1.0
      </div>
    </div>
  );
}

function FileManagerContent() {
  const files = [
    { name: 'Documents', icon: '📁', size: '4.0 KB', date: '2024-01-15' },
    { name: 'Downloads', icon: '📁', size: '12.3 MB', date: '2024-01-14' },
    { name: 'main.py', icon: '🐍', size: '2.1 KB', date: '2024-01-13' },
    { name: 'config.yaml', icon: '⚙️', size: '512 B', date: '2024-01-12' },
    { name: 'README.md', icon: '📄', size: '1.8 KB', date: '2024-01-11' },
    { name: 'data.csv', icon: '📊', size: '45.2 KB', date: '2024-01-10' },
    { name: 'script.sh', icon: '🖥️', size: '890 B', date: '2024-01-09' },
  ];

  return (
    <div className="h-full flex flex-col font-mono text-xs">
      <div className="bg-gray-200 border-b border-gray-400 px-2 py-1 flex items-center gap-2">
        <button className="px-2 py-0.5 bg-gray-300 rounded border border-gray-400 hover:bg-gray-400">←</button>
        <button className="px-2 py-0.5 bg-gray-300 rounded border border-gray-400 hover:bg-gray-400">→</button>
        <button className="px-2 py-0.5 bg-gray-300 rounded border border-gray-400 hover:bg-gray-400">↑</button>
        <div className="flex-1 bg-white border border-gray-400 px-2 py-0.5 rounded">
          /home/pi/
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-200 border-b border-gray-400 sticky top-0">
            <tr>
              <th className="text-left px-2 py-1">Name</th>
              <th className="text-left px-2 py-1">Size</th>
              <th className="text-left px-2 py-1">Date</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.name} className="hover:bg-blue-100 border-b border-gray-200 cursor-pointer">
                <td className="px-2 py-1">
                  <span className="mr-1">{file.icon}</span>
                  {file.name}
                </td>
                <td className="px-2 py-1 text-gray-600">{file.size}</td>
                <td className="px-2 py-1 text-gray-600">{file.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-200 border-t border-gray-400 px-2 py-1 text-gray-600">
        7 items — /home/pi/
      </div>
    </div>
  );
}

function TerminalContent() {
  return (
    <div className="h-full bg-gray-900 text-green-400 font-mono text-xs p-3 overflow-auto">
      <div>pi@raspberrypi:~$ uname -a</div>
      <div className="text-gray-400">Linux raspberrypi 6.1.0-rpi-v8 #1 SMP aarch64 GNU/Linux</div>
      <div className="mt-1">pi@raspberrypi:~$ zig version</div>
      <div className="text-gray-400">0.17.0</div>
      <div className="mt-1">pi@raspberrypi:~$ zig build-exe zigwm.zig -O ReleaseSmall</div>
      <div className="text-gray-400">Compile [release-small] ... OK</div>
      <div className="text-gray-400">Binary size: 142 KB (optimized for RPi)</div>
      <div className="mt-1">pi@raspberrypi:~$ free -h</div>
      <div className="text-gray-400">              total   used   free   shared  buff/cache</div>
      <div className="text-gray-400">Mem:          1.8Gi  256Mi  1.2Gi   12Mi    380Mi</div>
      <div className="mt-1">pi@raspberrypi:~$ <span className="animate-pulse">█</span></div>
    </div>
  );
}

function TextEditorContent() {
  return (
    <div className="h-full flex flex-col font-mono text-xs">
      <div className="bg-gray-200 border-b border-gray-400 px-2 py-1 flex gap-3 text-gray-700">
        <span className="hover:underline cursor-pointer">File</span>
        <span className="hover:underline cursor-pointer">Edit</span>
        <span className="hover:underline cursor-pointer">Search</span>
        <span className="hover:underline cursor-pointer">Help</span>
      </div>
      <div className="flex-1 bg-white p-2 overflow-auto">
        <pre className="text-gray-800">
{`#!/usr/bin/env python3
"""ZigWM Control Panel - Tkinter"""
import tkinter as tk

class ZigWMConfig:
    def __init__(self):
        self.window = tk.Tk()
        self.window.title("ZigWM Settings")
        self.window.geometry("300x200")
        
        # Theme settings
        self.theme = tk.StringVar(value="dark")
        self.border_width = tk.IntVar(value=2)
        
        self._build_ui()
    
    def _build_ui(self):
        frame = tk.Frame(self.window, padx=10, pady=10)
        frame.pack(fill="both", expand=True)
        
        tk.Label(frame, text="ZigWM v0.1").pack()
        tk.Label(frame, text="Optimized for RPi").pack()

if __name__ == "__main__":
    app = ZigWMConfig()
    app.window.mainloop()`}
        </pre>
      </div>
      <div className="bg-gray-200 border-t border-gray-400 px-2 py-0.5 text-gray-600 flex justify-between">
        <span>Ln 1, Col 1</span>
        <span>Python UTF-8</span>
      </div>
    </div>
  );
}

function SettingsContent() {
  return (
    <div className="h-full bg-gray-100 p-4 font-mono text-xs">
      <h3 className="font-bold text-sm mb-3 text-gray-800">⚙️ ZigWM Settings</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-300">
          <span>Window Border Width</span>
          <span className="text-blue-600 font-bold">2px</span>
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-300">
          <span>Compositing</span>
          <span className="text-red-600 font-bold">OFF (RPi optimized)</span>
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-300">
          <span>Animation</span>
          <span className="text-red-600 font-bold">OFF</span>
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-300">
          <span>Memory Limit</span>
          <span className="text-green-600 font-bold">8 MB</span>
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-300">
          <span>Backend</span>
          <span className="text-purple-600 font-bold">X11 / DRM</span>
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-300">
          <span>Taskbar Position</span>
          <span className="text-gray-600 font-bold">Bottom</span>
        </div>
        <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-300">
          <span>Taskbar Auto-resize</span>
          <span className="text-green-600 font-bold">ON ✓</span>
        </div>
      </div>
    </div>
  );
}

function SysMonitorContent() {
  return (
    <div className="h-full bg-gray-900 text-green-400 font-mono text-xs p-3 overflow-auto">
      <div className="mb-2 text-yellow-400 font-bold">═══ System Monitor ═══</div>
      <div className="space-y-2">
        <div>
          <div>CPU: ████████░░ 78%</div>
          <div className="text-gray-500">ARM Cortex-A53 @ 1.2GHz</div>
        </div>
        <div>
          <div>RAM: █████░░░░░ 45% (820MB/1.8GB)</div>
          <div className="text-gray-500">ZigWM: 2.1MB | X11: 45MB</div>
        </div>
        <div>
          <div>GPU: ███░░░░░░░ 28%</div>
          <div className="text-gray-500">VideoCore IV</div>
        </div>
        <div>
          <div className="text-cyan-400">Windows: 3 active</div>
          <div className="text-cyan-400">FPS: 60 (vsync)</div>
          <div className="text-cyan-400">WM Memory: 2.1 MB</div>
        </div>
        <div className="mt-2 text-gray-500">
          <div>Uptime: 4h 23m 17s</div>
          <div>Temp: 42°C</div>
        </div>
      </div>
    </div>
  );
}

function DefaultContent() {
  return (
    <div className="h-full flex items-center justify-center bg-gray-100 font-mono text-sm text-gray-500">
      <div className="text-center">
        <div className="text-4xl mb-2">🖥️</div>
        <div>Tkinter Application</div>
      </div>
    </div>
  );
}
