export interface DictionaryItem {
  name: string;
  shape: {
    modelPath: string;
    targetSize: number;
    unit: string;
  };
  taste: {
    sweet: number;
    sour: number;
    salty: number;
    bitter: number;
    umami: number;
  };
  color: {
    colorRegion?: {
      min: { r: number; g: number; b: number };
      max: { r: number; g: number; b: number };
    };
  };
}
