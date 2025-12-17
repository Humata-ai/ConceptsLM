import TasteSpiderChart from './components/TasteSpiderChart';

export default function Home() {
  return (
    <TasteSpiderChart
      tasteValues={{
        sweet: 0.8,
        sour: 0.3,
        salty: 0.6,
        bitter: 0.2,
        umami: 0.7,
      }}
    />
  );
}
