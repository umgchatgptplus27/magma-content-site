export function parseSavedMeasurements(raw: string): Record<string, Record<string, { mine: string; target: string }>>;
export function measurementDifference(mine: number, target: number): number;
export function measurementsCsv(item: string, rows: { label: string; mine: number; target: number }[]): string;
