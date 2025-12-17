'use client';

import { LABColor, RGBColor, rgbToHex } from '../utils/colorConversion';

interface ColorInfoHUDProps {
  selectedColor: {
    lab: LABColor;
    rgb: RGBColor;
  } | null;
}

export default function ColorInfoHUD({ selectedColor }: ColorInfoHUDProps) {
  if (!selectedColor) {
    return (
      <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg border border-white/20 backdrop-blur-sm">
        <p className="text-sm text-gray-400">Click a sphere to see color info</p>
      </div>
    );
  }

  const { lab, rgb } = selectedColor;
  const hexColor = rgbToHex(rgb);

  return (
    <div className="fixed top-4 right-4 bg-black/90 text-white p-6 rounded-lg border border-white/30 backdrop-blur-sm shadow-2xl min-w-[280px]">
      <h3 className="text-lg font-bold mb-4 border-b border-white/20 pb-2">Selected Color</h3>

      <div className="mb-4 flex items-center gap-3">
        <div
          className="w-20 h-20 rounded-lg border-2 border-white/40 shadow-lg"
          style={{ backgroundColor: hexColor }}
        />
        <div>
          <div className="text-2xl font-mono font-bold">{hexColor}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="bg-white/5 p-3 rounded">
          <h4 className="text-xs font-semibold text-gray-400 mb-1">L*A*B* Values</h4>
          <div className="font-mono text-sm">
            <div>L* = {lab.l.toFixed(1)}</div>
            <div>A* = {lab.a.toFixed(1)}</div>
            <div>B* = {lab.b.toFixed(1)}</div>
          </div>
        </div>

        <div className="bg-white/5 p-3 rounded">
          <h4 className="text-xs font-semibold text-gray-400 mb-1">RGB Values</h4>
          <div className="font-mono text-sm">
            <div className="flex items-center gap-2">
              <span className="text-red-400">R</span> = {rgb.r}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">G</span> = {rgb.g}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">B</span> = {rgb.b}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
