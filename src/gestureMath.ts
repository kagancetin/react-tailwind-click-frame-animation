/**
 * Math utilities for pointer coordinates, distance calculation, and swipe trigonometry.
 */

export interface Point {
  x: number;
  y: number;
}

export interface SwipeResult {
  isSwipe: boolean;
  distance: number;
  angleRad: number;
  angleDeg: number;
  dx: number;
  dy: number;
}

/**
 * Calculates vector distance and angle between two pointer points.
 * Returns isSwipe: false if the total displacement is beneath minDistance.
 */
export function calculateSwipe(
  start: Point,
  end: Point,
  minDistance: number = 25
): SwipeResult {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.hypot(dx, dy);

  // If travel distance is below threshold, treat as a stationary click/tap
  if (distance < minDistance) {
    return { isSwipe: false, distance: 0, angleRad: 0, angleDeg: 0, dx: 0, dy: 0 };
  }

  const angleRad = Math.atan2(dy, dx);
  const angleDeg = (angleRad * 180) / Math.PI;

  return {
    isSwipe: true,
    distance,
    angleRad,
    angleDeg,
    dx,
    dy,
  };
}
