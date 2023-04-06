import { Canvas } from './render/canvas'
import { Grid, GridBuilder } from './render/grid'

export class App {
  private static instance: App;
  private canvas = Canvas.getInstance();
  private grid: Grid;

  private constructor() {
    this.grid = new GridBuilder().build();
    this.grid.createSheet();
  }

  static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }
}
