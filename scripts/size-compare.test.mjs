import test from "node:test";
import assert from "node:assert/strict";
import { parseSavedMeasurements, measurementDifference, measurementsCsv } from "../src/lib/size-compare.mjs";

test("invalid saved measurements cannot break calculator rendering", () => {
  for (const raw of ["null", "[]", "1", '"text"', "{", '{"shirt":null}', '{"shirt":{"chest":null}}', '{"shirt":{"chest":{"mine":54,"target":"56"}}}']) {
    assert.deepEqual(parseSavedMeasurements(raw), {}, raw);
  }
  const saved = { shirt: { chest: { mine: "54", target: "56" } }, trouser: { waist: { mine: "42.5", target: "" } } };
  assert.deepEqual(parseSavedMeasurements(JSON.stringify(saved)), saved);
});

test("difference matches displayed tenth-centimetre precision", () => {
  assert.equal(measurementDifference(54, 56), 2);
  assert.equal(measurementDifference(61, 60), -1);
  assert.equal(measurementDifference(54.1, 54.2), 0.1);
  assert.equal(Math.abs(measurementDifference(54, 53.99)), 0);
  assert.equal(measurementDifference(54, 54.01), 0);
});


test("CSV preserves valid measurements and signed differences without inventing missing values", () => {
  const csv = measurementsCsv("셔츠·티셔츠", [
    { label: "가슴단면", mine: 54, target: 56 },
    { label: "소매길이", mine: 61, target: 60 },
    { label: "총장", mine: 70, target: 70 },
    { label: "미입력", mine: 0, target: 60 },
    { label: "잘못된 입력", mine: NaN, target: 60 },
  ]);
  assert.ok(csv.startsWith("\uFEFF"));
  assert.ok(csv.includes('"가슴단면","54","56","2.0"'));
  assert.ok(csv.includes('"소매길이","61","60","-1.0"'));
  assert.ok(csv.includes('"총장","70","70","0.0"'));
  assert.ok(!csv.includes("미입력") && !csv.includes("잘못된 입력"));
  assert.equal(csv.trimEnd().split("\r\n").length, 4);
});
