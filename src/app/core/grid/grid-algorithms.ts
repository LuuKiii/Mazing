import { AvailableGenerationAlgorithms, generationFnFactory } from "../algorithms/generation/generation-factory";
import { Tile } from "./tile";

export class GridAlgorithms {
  //not sure if this will execute both patfinding and generation algorithms universally or will i create two sepearte methods for them
  static execute(algorithm: AvailableGenerationAlgorithms, matrix: Tile[][]): void {
    const fnToExecute = generationFnFactory(algorithm);
    fnToExecute(matrix);
  }

  // i want to be able to execute algorithms both 'instantly' and 'in steps' which will create this sort of animation as algorithm executes.
  static executeInSteps(): void {

  }
}
