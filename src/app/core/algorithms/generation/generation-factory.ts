import { Tile } from "../../grid/tile";
import { generateMazeDFS } from "./depth-first-search";

export function generationFnFactory(algorithm: AvailableGenerationAlgorithms): MazeGenerationFn {
  return generateMazeDFS
}

export type AvailableGenerationAlgorithms = 'DFS'
export type MazeGenerationFn = (matrix: Tile[][]) => void;
