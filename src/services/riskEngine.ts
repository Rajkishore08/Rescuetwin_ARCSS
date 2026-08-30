import type { RiskDecomposition } from '../types/digitalTwin';

/**
 * Deterministic, transparent mathematical risk model representing
 * simulated multi-factor risk inference for disaster operations.
 */
export function calculateStructuralRisk(params: {
  vibration: number; // nominal ~4.8, spike ~8.7
  structuralMovementCm: number; // nominal ~2.4, spike ~6.8
  temperature: number; // nominal ~71°C
  gasPpm: number;
  debrisInstabilityFactor: number;
}): { riskPct: number; decomposition: RiskDecomposition } {
  const { vibration, structuralMovementCm, temperature, gasPpm, debrisInstabilityFactor } = params;

  // Normalized factor calculations
  // Vibration contribution (0 - 35 points): baseline 4.8 mm/s is ~12 pts, 8.7 mm/s is ~32 pts
  const vibNorm = Math.min(Math.max((vibration - 2.0) / 8.0, 0), 1.0);
  const vibrationContribution = Math.round(vibNorm * 35);

  // Structural displacement contribution (0 - 30 points)
  const dispNorm = Math.min(Math.max(structuralMovementCm / 8.0, 0), 1.0);
  const structuralDamage = Math.round(dispNorm * 30);

  // Temperature / thermal hotspot contribution (0 - 15 points)
  const tempNorm = Math.min(Math.max((temperature - 20) / 100.0, 0), 1.0);
  const temperatureContribution = Math.round(tempNorm * 15);

  // Gas / environmental hazard contribution (0 - 10 points)
  const gasNorm = Math.min(Math.max(gasPpm / 150.0, 0), 1.0);
  const hazardContribution = Math.round(gasNorm * 10);

  // Rate of change & debris instability (0 - 10 points)
  const recentRateOfChange = Math.round(debrisInstabilityFactor * 10);

  const total = vibrationContribution + structuralDamage + temperatureContribution + hazardContribution + recentRateOfChange;
  const totalComputedRiskPct = Math.min(Math.max(total, 5), 99);

  return {
    riskPct: totalComputedRiskPct,
    decomposition: {
      vibrationContribution,
      structuralDamage,
      temperatureContribution,
      hazardContribution,
      recentRateOfChange,
      totalComputedRiskPct,
    }
  };
}
