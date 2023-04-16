import { AppStateObserver } from '../state/state.interface'
import { ScreenModes } from '../state/state';
import { Store } from '../state/store'
import { Menu } from './menu';

export class WindowManager implements AppStateObserver {
  private static instance: WindowManager;

  private wrapperEl: HTMLElement;
  private headerEl: HTMLElement;
  private menu: Menu;
  private currentScreenMode: ScreenModes | null = null;
  private store: Store;

  constructor() {
    this.wrapperEl = document.getElementById('main')!;
    this.headerEl = document.getElementById('header')!;
    this.menu = Menu.getInstance();
    this.store = Store.getInstance();
    this.store.subscribe(this);
    this.onAppStateChange()
  }

  onAppStateChange(): void {
    const nextScreenMode = this.store.getState().screenMode;
    this.applyScreenMode(nextScreenMode);
  }

  applyScreenMode(nextScreenMode: ScreenModes) {
    if (nextScreenMode === this.currentScreenMode) return;

    this.currentScreenMode = nextScreenMode;

    switch (this.currentScreenMode) {
      case 'Fullscreen':
        this.wrapperEl.classList.add('fullscreen-mode')
        this.headerEl.classList.add('fullscreen-mode')
        document.body.classList.add('fullscreen-mode')
        break;
      case 'Desktop-wrapped':
        this.wrapperEl.classList.remove('fullscreen-mode')
        this.headerEl.classList.remove('fullscreen-mode')
        document.body.classList.remove('fullscreen-mode')
        break;
    }
  }

  static getInstance(): WindowManager {
    if (!WindowManager.instance) {
      WindowManager.instance = new WindowManager();
    }
    return WindowManager.instance;
  }
}
