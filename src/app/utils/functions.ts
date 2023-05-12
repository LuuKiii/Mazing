import { Point, PointRange } from '../core/utils';

/**
 * @param length - length of ID to be generated
 * @returns string - generated ID
 */
export function generateRandomID(length = 8): string {
  let lettersAndDigits = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomID = '';
  for (let i = 0; i < length; i++) {
    randomID += lettersAndDigits.charAt(Math.floor(Math.random() * lettersAndDigits.length));
  }
  return randomID;
}

/**
 * Shuffles contents of passed array 
 * @param arr - array with any contents
 */
export function shuffle(arr: any[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * Checks whether passed value is within passed range
 * @param value 
 * @param range 
 * @returns boolean
 */
export function isWithinRange(value: number, range: { start: number, end: number }): boolean {
  return value >= range.start && value <= range.end
}

/**
 * Checks whether passed Point is Within passed 2D range
 * @param point 
 * @param range 
 * @returns boolean
 */
export function isWithinRange2D(point: Point, range: PointRange): boolean {
  return point.x >= range.start.x && point.x <= range.end.x &&
    point.y >= range.start.y && point.y <= range.end.y
}

/**
 * Creates random point within passed range
 * @param pointRange 
 * @returns Point
 */
export function getRandomPoint(pointRange: PointRange = { start: { x: 0, y: 0 }, end: { x: 10, y: 10 } }): Point {
  pointRange.end.x -= pointRange.start.x;
  pointRange.end.y -= pointRange.start.y;
  return {
    x: Math.floor(Math.random() * pointRange.end.x + pointRange.start.x),
    y: Math.floor(Math.random() * pointRange.end.y + pointRange.start.y)
  }
}
