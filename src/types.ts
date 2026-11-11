export interface WindowState {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  icon: string;
  content: string;
  prevBounds?: { x: number; y: number; width: number; height: number };
}

export interface TaskbarItem {
  id: string;
  title: string;
  icon: string;
  minimized: boolean;
}
