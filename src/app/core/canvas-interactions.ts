import { Position } from "./utils";

export class CanvasInteractions {
  private static instance: CanvasInteractions;
  private element: HTMLCanvasElement;
  private mousePos: Position = { x: -1, y: -1 };

  private mouseObservers: MouseObserver[] = [];

  private constructor() {
    this.element = document.getElementById('canvas') as HTMLCanvasElement;

    this.setListeners()
  }

  setListeners(): void {
    this.element.addEventListener('mousemove', (ev: MouseEvent) => {
      const rect = this.element.getBoundingClientRect();
      this.mousePos.x = ev.clientX - rect.left;
      this.mousePos.y = ev.clientY - rect.top;

      this.updateMouseObservers();
    })
  }

  getMousePos(): Position {
    return this.mousePos;
  }

  subscribeToMouseUpdates(newObserver: MouseObserver): void {
    this.mouseObservers.push(newObserver)
  }

  unSubscribeToMouseUpdates(observer: MouseObserver): void {
    this.mouseObservers = this.mouseObservers.filter(ob => ob !== observer)
  }

  updateMouseObservers(): void {
    this.mouseObservers.forEach(ob => ob.updateFromMouse(this.getMousePos()))
  }

  static getInstance(): CanvasInteractions {
    if (!CanvasInteractions.instance) {
      CanvasInteractions.instance = new CanvasInteractions();
    }
    return CanvasInteractions.instance;
  }
}

export interface MouseObserver {
  updateFromMouse(mousePosition: Position): void;
}
