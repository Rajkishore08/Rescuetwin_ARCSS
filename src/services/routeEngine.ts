import type { RouteOption } from '../types/mission';

/**
 * Route Optimization Engine:
 * Evaluates rescue paths based on multi-objective cost:
 * COST = Distance_Weight * Distance + Risk_Weight * Structural_Risk + Hazard_Penalty
 */
export function calculateOptimalRescueRoutes(
  zoneARiskPct: number,
  zoneBRiskPct: number,
  zoneCRiskPct: number
): { routes: RouteOption[]; recommendedId: 'A' | 'B' | 'C'; reason: string } {
  // Route A travels through North Section (Zone A)
  const routeARisk = Math.min(Math.max(Math.round(zoneARiskPct * 0.98), 20), 96);
  // Route B travels through East Wing (Zone B)
  const routeBRisk = Math.min(Math.max(Math.round(zoneBRiskPct * 0.95), 18), 70);
  // Route C travels through South Perimeter (Zone C)
  const routeCRisk = Math.min(Math.max(Math.round(zoneCRiskPct * 1.1), 25), 80);

  // Distances
  const distA = 28;
  const distB = 41;
  const distC = 35;

  // Cost function calculation
  // Cost = (Distance * 0.8) + (Risk * 2.2)
  const costA = Math.round(distA * 0.8 + routeARisk * 2.2);
  const costB = Math.round(distB * 0.8 + routeBRisk * 2.2);
  const costC = Math.round(distC * 0.8 + routeCRisk * 2.2);

  // Determine recommendation
  let recommendedId: 'A' | 'B' | 'C' = 'B';
  let reason = 'Route B recommended: optimal safety-to-distance ratio despite longer physical path.';

  if (routeARisk > 60) {
    recommendedId = costB <= costC ? 'B' : 'C';
    reason = `Route A rejected (${routeARisk}% hazard index): severe structural collapse danger in North Section. Diverting team to Route ${recommendedId}.`;
  } else if (costA < costB && costA < costC) {
    recommendedId = 'A';
    reason = 'Route A recommended: rapid 28m ingress with acceptable structural stability.';
  }

  const routes: RouteOption[] = [
    {
      id: 'A',
      name: 'ROUTE A — North Corridor',
      distanceMeters: distA,
      structuralRiskPct: routeARisk,
      hazardExposurePct: Math.round(routeARisk * 0.9),
      predictedFutureRiskPct: Math.min(routeARisk + 8, 98),
      survivorReachProbabilityPct: routeARisk > 60 ? 42 : 88,
      totalCostScore: costA,
      status: recommendedId === 'A' ? 'RECOMMENDED' : 'REJECTED',
      rejectionReason: routeARisk > 60 ? 'Unstable ceiling slab & 8.7 mm/s seismic resonance in North Core' : undefined,
      color: routeARisk > 60 ? '#ef4444' : '#f59e0b',
    },
    {
      id: 'B',
      name: 'ROUTE B — East Shear Ramp',
      distanceMeters: distB,
      structuralRiskPct: routeBRisk,
      hazardExposurePct: Math.round(routeBRisk * 0.7),
      predictedFutureRiskPct: routeBRisk + 2,
      survivorReachProbabilityPct: 91,
      totalCostScore: costB,
      status: recommendedId === 'B' ? 'RECOMMENDED' : 'STANDBY',
      color: '#10b981',
    },
    {
      id: 'C',
      name: 'ROUTE C — South Gantry',
      distanceMeters: distC,
      structuralRiskPct: routeCRisk,
      hazardExposurePct: Math.round(routeCRisk * 0.85),
      predictedFutureRiskPct: routeCRisk + 5,
      survivorReachProbabilityPct: 74,
      totalCostScore: costC,
      status: recommendedId === 'C' ? 'RECOMMENDED' : 'STANDBY',
      color: '#00f0ff',
    },
  ];

  return { routes, recommendedId, reason };
}
