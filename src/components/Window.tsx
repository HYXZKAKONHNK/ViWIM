import { WindowState } from '../types';
import { TkinterContent } from './TkinterContent';

interface WindowProps {
  window: WindowState;
  onFocus: (id: string) => void;
  onDragStart: (id: string, e: React.MouseEvent) => void;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
}

export function Window({
  window: win,
  onFocus,
  onDragStart,
  onClose,
  onMinimize,
  onMaximize,
}: WindowProps) {
  return (
    <div
      className="absolute flex flex-col rounded-t-lg shadow-2xl border border-gray-600 overflow-hidden"
      style={{
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      }}
      onMouseDown={() => onFocus(win.id)}
    >
      {/* Title Bar */}
      <div
        className="flex items-center h-8 px-2 bg-gradient-to-r from-gray-700 to-gray-600 cursor-move shrink-0"
        onMouseDown={(e) => onDragStart(win.id, e)}
        onDoubleClick={() => onMaximize(win.id)}
      >
        <span className="text-sm mr-2">{win.icon}</span>
        <span className="text-xs text-gray-200 font-mono truncate flex-1">
          {win.title}
        </span>
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize(win.id);
            }}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-yellow-500 text-gray-300 hover:text-black text-xs transition-colors"
          >
            ─
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMaximize(win.id);
            }}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-green-500 text-gray-300 hover:text-black text-xs transition-colors"
          >
            □
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose(win.id);
            }}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-red-500 text-gray-300 hover:text-black text-xs transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 bg-gray-100 overflow-auto">
        <TkinterContent type={win.content} />
      </div>
    </div>
  );
}
