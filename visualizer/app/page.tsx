'use client';

import { useState } from 'react';
import ConceptualSpace from './components/ConceptualSpace';
import ColorInfoHUD from './components/ColorInfoHUD';
import spaceConfig from './config/conceptual-space.json';
import { LABColor, RGBColor } from './utils/colorConversion';

export default function Home() {
  const [selectedColor, setSelectedColor] = useState<{
    lab: LABColor;
    rgb: RGBColor;
  } | null>(null);

  const handleColorSelect = (lab: LABColor, rgb: RGBColor) => {
    setSelectedColor({ lab, rgb });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <ConceptualSpace
        xRange={spaceConfig.xRange as [number, number]}
        yRange={spaceConfig.yRange as [number, number]}
        zRange={spaceConfig.zRange as [number, number]}
        samplingRate={spaceConfig.samplingRate}
        onColorSelect={handleColorSelect}
      />
      <ColorInfoHUD selectedColor={selectedColor} />
    </div>
  );
}
