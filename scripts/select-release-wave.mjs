// A newly staged revision belongs to its latest scheduled wave, not an older release.
export function selectReleaseWave(waves, today, stagedSlugs) {
  const latest = new Map();
  for (const wave of waves) {
    for (const slug of wave.pillars) {
      if (!latest.has(slug) || latest.get(slug).wave < wave.wave) latest.set(slug, wave);
    }
  }
  return waves
    .filter((wave) => wave.date <= today)
    .filter((wave) => wave.pillars.some((slug) => stagedSlugs.has(slug) && latest.get(slug) === wave))
    .sort((a, b) => a.wave - b.wave)[0]?.wave;
}
