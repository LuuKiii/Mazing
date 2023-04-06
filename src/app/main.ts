import { Canvas } from './render/canvas'
import { Grid, GridBuilder } from './render/grid'

export class App {
  private static instance: App;
  private canvas: Canvas;
  private grid: Grid;

  private constructor() {
    this.canvas = Canvas.getInstance();
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
