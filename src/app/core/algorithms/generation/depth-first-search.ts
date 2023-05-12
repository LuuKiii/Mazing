import { Tile } from '../../grid/tile';
import { MazeGenerationFn } from './generation-factory';
import { Point } from '../../utils';
import { shuffle } from '../../../utils/functions';

export const generateMazeDFS: MazeGenerationFn = (matrix: Tile[][]): void => {
  const frameWidth = 1;
  const startPoint: Point = { x: frameWidth, y: frameWidth };
  const endX = matrix.length - 1 - frameWidth;
  const endY = matrix[0].length - 1 - frameWidth;

  dfs(startPoint, matrix);

  function dfs(currentPoint: Point, matrix: Tile[][]) {
    matrix[currentPoint.x][currentPoint.y].setType('EMPTY');

    const directions = [
      [-2, 0], //top
      [0, 2], // right
      [2, 0], // down
      [0, -2], // left
    ]

    shuffle(directions);

    for (const [dX, dY] of directions) {
      const newX = currentPoint.x + dX;
      const newY = currentPoint.y + dY;

      if (newX >= frameWidth && newX <= endX && newY >= frameWidth && newY <= endY && matrix[newX][newY].getType() === 'WALL') {
        const wallX = currentPoint.x + dX / 2;
        const wallY = currentPoint.y + dY / 2;
        matrix[wallX][wallY].setType('EMPTY');
        dfs({ x: newX, y: newY }, matrix);
      }
    }
  }
}
