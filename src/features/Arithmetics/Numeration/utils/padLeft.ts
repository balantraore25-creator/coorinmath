export function padLeft<T>(arr: T[], length: number, filler: T): T[] {
  const padSize = length - arr.length;
  return Array(Math.max(0, padSize)).fill(filler).concat(arr);
}
