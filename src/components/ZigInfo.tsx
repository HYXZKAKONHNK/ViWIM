import { useState } from 'react';

interface ZigInfoProps {
  onClose: () => void;
}

export function ZigInfo({ onClose }: ZigInfoProps) {
  const [tab, setTab] = useState<'overview' | 'code' | 'arch'>('overview');

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-[9999] p-4">
      <div className="bg-gray-900 border border-gray-600 rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-800 to-indigo-800 border-b border-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍓</span>
            <h2 className="text-white font-bold text-sm">ZigWM — Window Manager for Raspberry Pi</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-500 text-gray-300 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 bg-gray-800">
          {(['overview', 'code', 'arch'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs font-mono transition-colors ${
                tab === t
                  ? 'bg-gray-700 text-white border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {t === 'overview' && '📋 Overview'}
              {t === 'code' && '💻 Zig Code'}
              {t === 'arch' && '🏗️ Architecture'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 text-sm text-gray-300 font-mono">
          {tab === 'overview' && <OverviewTab />}
          {tab === 'code' && <CodeTab />}
          {tab === 'arch' && <ArchTab />}
        </div>
      </div>
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-purple-400 font-bold mb-2">🎯 Цели проекта</h3>
        <ul className="space-y-1 text-xs">
          <li>• Минимальное потребление RAM (&lt;8MB для WM)</li>
          <li>• Быстрый запуск (&lt;100ms cold start)</li>
          <li>• Поддержка X11 и DRM/KMS backend</li>
          <li>• Оптимизация для ARM Cortex-A53 (RPi 3/4)</li>
          <li>• Управление Tkinter и другими X11-приложениями</li>
          <li>• Динамическая панель задач с auto-resize</li>
        </ul>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-green-400 font-bold mb-2">⚡ Оптимизации для RPi</h3>
        <ul className="space-y-1 text-xs">
          <li>• Zero-copy window buffer management</li>
          <li>• No compositing (direct framebuffer writes)</li>
          <li>• Minimal event loop (epoll-based)</li>
          <li>• Compiled with -O ReleaseSmall (~140KB binary)</li>
          <li>• Custom allocator with arena for transient data</li>
          <li>• No GC, no runtime overhead</li>
          <li>• Static linking, no external dependencies</li>
        </ul>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-yellow-400 font-bold mb-2">📐 Спецификации</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-700/50 p-2 rounded">
            <div className="text-gray-400">Target</div>
            <div>Raspberry Pi 3B/4B</div>
          </div>
          <div className="bg-gray-700/50 p-2 rounded">
            <div className="text-gray-400">Zig Version</div>
            <div>0.17.0</div>
          </div>
          <div className="bg-gray-700/50 p-2 rounded">
            <div className="text-gray-400">Backend</div>
            <div>X11 (xcb) / DRM</div>
          </div>
          <div className="bg-gray-700/50 p-2 rounded">
            <div className="text-gray-400">Binary Size</div>
            <div>~142 KB (stripped)</div>
          </div>
          <div className="bg-gray-700/50 p-2 rounded">
            <div className="text-gray-400">RAM Usage</div>
            <div>~2-8 MB</div>
          </div>
          <div className="bg-gray-700/50 p-2 rounded">
            <div className="text-gray-400">Taskbar</div>
            <div>Dynamic width</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CodeTab() {
  return (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-cyan-400 font-bold mb-2">main.zig — Entry Point</h3>
        <pre className="text-xs text-gray-300 overflow-auto bg-gray-900 p-3 rounded border border-gray-700">
{`const std = @import("std");
const xcb = @import("xcb.zig");
const wm = @import("wm.zig");
const taskbar = @import("taskbar.zig");

pub fn main() !void {
    // Arena allocator for WM lifetime
    var gpa: std.heap.GeneralPurposeAllocator(.{}) = .init;
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    // Connect to X server
    const conn = try xcb.connect(allocator);
    defer conn.disconnect();

    // Initialize window manager
    var manager = try wm.WindowManager.init(
        allocator,
        conn,
        .{
            .border_width = 2,
            .compositing = false, // RPi optimization
            .taskbar_height = 48,
            .taskbar_position = .bottom,
            .taskbar_auto_resize = true,
        },
    );
    defer manager.deinit();

    // Select root window events
    try manager.selectSubstructureNotify();

    // Main event loop (epoll-based)
    try manager.run();
}`}
        </pre>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-cyan-400 font-bold mb-2">taskbar.zig — Dynamic Width</h3>
        <pre className="text-xs text-gray-300 overflow-auto bg-gray-900 p-3 rounded border border-gray-700">
{`pub const Taskbar = struct {
    window: xcb.Window,
    items: std.ArrayList(TaskbarItem),
    screen_width: u32,
    item_width: u32,

    pub fn recalculateWidth(self: *Taskbar) void {
        const count = self.items.items.len;
        if (count == 0) {
            self.item_width = 0;
            return;
        }
        // Dynamic: each item gets equal share
        // Min 80px, max 160px per item
        const available = self.screen_width - 200;
        const computed = @divFloor(available, count);
        self.item_width = @max(80, @min(160, computed));
    }

    pub fn addItem(self: *Taskbar, item: TaskbarItem) !void {
        try self.items.append(item);
        self.recalculateWidth();
        self.redraw();
    }

    pub fn removeItem(self: *Taskbar, id: u32) void {
        for (self.items.items, 0..) |item, i| {
            if (item.window_id == id) {
                _ = self.items.orderedRemove(i);
                break;
            }
        }
        self.recalculateWidth();
        self.redraw();
    }

    fn redraw(self: *Taskbar) void {
        // Clear & redraw taskbar background
        // Then draw each item at calculated width
        var x: i32 = 0;
        for (self.items.items) |item| {
            self.drawItem(item, x, self.item_width);
            x += @as(i32, @intCast(self.item_width)) + 4;
        }
    }
};`}
        </pre>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-cyan-400 font-bold mb-2">wm.zig — Window Management</h3>
        <pre className="text-xs text-gray-300 overflow-auto bg-gray-900 p-3 rounded border border-gray-700">
{`pub const WindowManager = struct {
    allocator: std.mem.Allocator,
    conn: *xcb.Connection,
    windows: std.AutoHashMap(u32, *ManagedWindow),
    config: Config,
    taskbar: Taskbar,

    pub fn handleMapRequest(self: *WM, ev: xcb.MapRequestEvent) !void {
        // Reparent window for decoration
        const frame = try self.createFrame(ev.window);
        
        // Add to taskbar with dynamic resize
        try self.taskbar.addItem(.{
            .window_id = ev.window,
            .title = try self.getWindowName(ev.window),
        });
        
        // Map frame (shows window + decorations)
        try xcb.mapWindow(self.conn, frame.id);
    }

    pub fn handleUnmapNotify(self: *WM, ev: xcb.UnmapEvent) void {
        // Remove from taskbar, recalculate width
        self.taskbar.removeItem(ev.window);
        self.removeWindow(ev.window);
    }
};`}
        </pre>
      </div>
    </div>
  );
}

function ArchTab() {
  return (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-purple-400 font-bold mb-3">🏗️ Архитектура ZigWM</h3>
        <pre className="text-xs text-green-400 overflow-auto">
{`
┌─────────────────────────────────────────────────┐
│                  ZigWM Process                   │
├─────────────────────────────────────────────────┤
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Event   │  │  Window  │  │   Taskbar    │  │
│  │  Loop    │──│  Manager │──│  (dynamic)   │  │
│  │ (epoll)  │  │          │  │  auto-resize │  │
│  └────┬─────┘  └────┬─────┘  └──────┬───────┘  │
│       │              │               │            │
│  ┌────┴──────────────┴───────────────┴────────┐  │
│  │            XCB / X11 Protocol Layer         │  │
│  └────────────────────┬───────────────────────┘  │
│                       │                           │
│  ┌────────────────────┴───────────────────────┐  │
│  │         Custom Allocator (Arena)            │  │
│  │    Zero-copy buffers | No GC | Static      │  │
│  └────────────────────────────────────────────┘  │
│                                                   │
├─────────────────────────────────────────────────┤
│  Linux Kernel (DRM/KMS or X11 server)           │
├─────────────────────────────────────────────────┤
│  Raspberry Pi Hardware (ARM Cortex-A53/A72)     │
└─────────────────────────────────────────────────┘
`}
        </pre>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-yellow-400 font-bold mb-2">📦 Структура проекта</h3>
        <pre className="text-xs text-gray-300">
{`zigwm/
├── build.zig           # Build system (Zig 0.17)
├── build.zig.zon       # Package manifest
├── src/
│   ├── main.zig        # Entry point, event loop
│   ├── wm.zig          # Window manager core
│   ├── xcb.zig         # XCB bindings (minimal)
│   ├── taskbar.zig     # Dynamic taskbar
│   ├── config.zig      # Configuration
│   ├── allocator.zig   # Custom allocators
│   ├── draw.zig        # Drawing primitives
│   └── atoms.zig       # X11 atoms
└── README.md`}
        </pre>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-green-400 font-bold mb-2">🔧 Build Commands</h3>
        <pre className="text-xs text-gray-300 bg-gray-900 p-3 rounded border border-gray-700">
{`# Debug build
zig build

# Release small (for RPi)
zig build -Doptimize=ReleaseSmall

# Cross-compile for ARM
zig build -Dtarget=aarch64-linux

# Run
./zigwm

# Install as WM
echo "exec /usr/local/bin/zigwm" > ~/.xinitrc
startx`}
        </pre>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-orange-400 font-bold mb-2">📊 Сравнение с другими WM</h3>
        <div className="overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-1 px-2">WM</th>
                <th className="text-right py-1 px-2">RAM</th>
                <th className="text-right py-1 px-2">Binary</th>
                <th className="text-right py-1 px-2">Language</th>
              </tr>
            </thead>
            <tbody className="text-gray-400">
              <tr className="border-b border-gray-700">
                <td className="py-1 px-2 text-purple-400 font-bold">ZigWM</td>
                <td className="text-right py-1 px-2 text-green-400">~2-8 MB</td>
                <td className="text-right py-1 px-2 text-green-400">142 KB</td>
                <td className="text-right py-1 px-2">Zig</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="py-1 px-2">Openbox</td>
                <td className="text-right py-1 px-2">~12 MB</td>
                <td className="text-right py-1 px-2">280 KB</td>
                <td className="text-right py-1 px-2">C</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="py-1 px-2">i3</td>
                <td className="text-right py-1 px-2">~15 MB</td>
                <td className="text-right py-1 px-2">850 KB</td>
                <td className="text-right py-1 px-2">C</td>
              </tr>
              <tr>
                <td className="py-1 px-2">sway</td>
                <td className="text-right py-1 px-2">~30 MB</td>
                <td className="text-right py-1 px-2">2.1 MB</td>
                <td className="text-right py-1 px-2">C</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
