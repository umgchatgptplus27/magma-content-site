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

export function measurementsCsv(item, rows) {
  const table = [["품목", "측정 항목", "내 옷(cm)", "사려는 옷(cm)", "차이(cm: 후보에서 내 옷 빼기)"]];
  for (const { label, mine, target } of rows) {
    if (!Number.isFinite(mine) || mine <= 0 || !Number.isFinite(target) || target <= 0) continue;
    table.push([item, label, mine, target, measurementDifference(mine, target).toFixed(1)]);
  }
  return "\uFEFF" + table.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\r\n") + "\r\n";
}
