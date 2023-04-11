import { AppStateObserver } from '../state/redux.interface'
import { ScreenModes } from '../state/state';
import { Store } from '../state/store'

export class WindowManager implements AppStateObserver {
  private static instance: WindowManager;

  private wrapperEl: HTMLElement;
  private headerEl: HTMLElement;
  private currentScreenMode: ScreenModes | null = null;
  private store: Store;

  constructor() {
    this.wrapperEl = document.getElementById('main')!;
    this.headerEl = document.getElementById('header')!;
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
        this.wrapperEl.style.maxWidth = '100%'
        document.body.style.overflow = 'hidden'
        this.headerEl.style.display = 'none'
        break;
      case 'Desktop-wrapped':
        this.wrapperEl.style.maxWidth = '1024px'
        document.body.style.overflow = 'inital'
        this.headerEl.style.display = 'block'
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
