declare module "@mapbox/polyline" {
  export function decode(
    encoded: string,
    precision?: number
  ): [number, number][];
  export function encode(
    coords: [number, number][],
    precision?: number
  ): string;
}
