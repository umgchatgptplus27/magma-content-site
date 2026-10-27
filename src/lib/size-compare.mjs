// Only restore the nested string values written by the calculator.
export function parseSavedMeasurements(raw) {
  try {
    const values = JSON.parse(raw);
    const record = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
    if (!record(values)) return {};
    for (const fields of Object.values(values)) {
      if (!record(fields)) return {};
      for (const pair of Object.values(fields)) {
        if (!record(pair) || typeof pair.mine !== "string" || typeof pair.target !== "string") return {};
      }
    }
    return values;
  } catch {
    return {};
  }
}

export function measurementDifference(mine, target) {
  return Math.round((target - mine) * 10) / 10;
}
