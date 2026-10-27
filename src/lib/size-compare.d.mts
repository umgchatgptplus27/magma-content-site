export function parseSavedMeasurements(raw: string): Record<string, Record<string, { mine: string; target: string }>>;
export function measurementDifference(mine: number, target: number): number;
