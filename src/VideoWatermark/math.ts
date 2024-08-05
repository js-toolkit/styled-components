export function getHipotenuza(katA: number, katB: number): number {
  return Math.sqrt(katA ** 2 + katB ** 2);
}

export function getTriangleHeight(katA: number, katB: number): number {
  const hip = getHipotenuza(katA, katB);
  return (katA * katB) / hip;
}

export function getAngleA(katA: number, katB: number): number {
  return (180 / Math.PI) * Math.atan2(katB, katA);
}
