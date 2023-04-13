import { Position } from "./utils";

export class CanvasInteractions {
  private static instance: CanvasInteractions;
  private element: HTMLCanvasElement;
  private mousePos: Position = { x: -1, y: -1 };
  private currentPressedButtons: PressedMouseButtonType = {
    lmb: false,
    rmb: false,
    mmb: false
  }

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

      this.updateMouseObservers('mousemove');
    })

    this.element.addEventListener('mouseleave', (ev: MouseEvent) => {
      this.updateMouseObservers('mouseleave')
    })

    this.element.addEventListener('mousedown', (ev: MouseEvent) => {
      this.currentPressedButtons[mouseButtons[ev.button] as keyof typeof mouseButtons] = true;
      this.updateMouseObservers('mousedown')
    })

    this.element.addEventListener('mouseup', (ev: MouseEvent) => {
      this.currentPressedButtons[mouseButtons[ev.button] as keyof typeof mouseButtons] = false;
      this.updateMouseObservers('mouseup')
    })

    this.element.addEventListener('contextmenu', (ev: MouseEvent) => {
      ev.preventDefault()
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

  updateMouseObservers(evType: MouseEventsType): void {
    this.mouseObservers.forEach(ob => ob.updateFromMouse(this.getMousePos(), evType, this.currentPressedButtons))
  }

  static getInstance(): CanvasInteractions {
    if (!CanvasInteractions.instance) {
      CanvasInteractions.instance = new CanvasInteractions();
    }
    return CanvasInteractions.instance;
  }
}

export interface MouseObserver {
  updateFromMouse(mousePosition: Position, eventType: MouseEventsType, buttonClicked?: PressedMouseButtonType): void;
}

export type MouseEventsType = 'mousemove' | 'mouseleave' | 'mouseup' | 'mousedown';

export type PressedMouseButtonType = Record<keyof typeof mouseButtons, boolean>

export enum mouseButtons {
  'lmb',
  'mmb',
  'rmb'
} 
