import ConceptualSpace from './components/ConceptualSpace';
import spaceConfig from './config/conceptual-space.json';

export default function Home() {
  return (
    <ConceptualSpace
      xRange={spaceConfig.xRange as [number, number]}
      yRange={spaceConfig.yRange as [number, number]}
      zRange={spaceConfig.zRange as [number, number]}
    />
  );
}
