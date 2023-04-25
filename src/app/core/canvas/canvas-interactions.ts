import { Position } from "../utils";

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

  private setListeners(): void {
    this.element.addEventListener('mousemove', (ev: MouseEvent) => {
      const rect = this.element.getBoundingClientRect();
      this.mousePos.x = ev.clientX - rect.left;
      this.mousePos.y = ev.clientY - rect.top;

      this.updateMouseObservers('mousemove');
    })

    //mouseleave needs to set all possibly clicked buttons to false, because when button was released outside of canvas element, this is not updated here.
    //mouseenter resets clickedbuttons
    this.element.addEventListener('mouseleave', (ev: MouseEvent) => {
      for (const keyName in this.currentPressedButtons) {
        this.currentPressedButtons[keyName as keyof PressedMouseButtonType] = false;
      }
      this.updateMouseObservers('mouseleave')
    })

    this.element.addEventListener('mouseenter', (ev: MouseEvent) => {
      //for some reason event.button is not correctly reported in this event, which lead to creating this monstrosity 
      if (ev.buttons === 1) this.currentPressedButtons.lmb = true;
      if (ev.buttons === 2) this.currentPressedButtons.rmb = true;
      if (ev.buttons === 3) {
        this.currentPressedButtons.lmb = true;
        this.currentPressedButtons.rmb = true;
      }
      this.updateMouseObservers('mouseenter')
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

export type MouseEventsType = 'mousemove' | 'mouseleave' | 'mouseenter' | 'mouseup' | 'mousedown';

export type PressedMouseButtonType = Record<keyof typeof mouseButtons, boolean>

export enum mouseButtons {
  'lmb',
  'mmb',
  'rmb'
} 
