import { Canvas } from './canvas'

export class App {
  private static instance: App;
  private canvas = Canvas.getInstance();

  private constructor() {
    
  }

  static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }
}
