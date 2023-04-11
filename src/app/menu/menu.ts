import { Store } from "../state/store";
import { Actions } from "../state/actions";

export class Menu {
  private static instance: Menu;
  private settingsEl: HTMLElement;
  private fullScrnEl: HTMLElement;
  private store: Store;

  private constructor() {
    this.settingsEl = document.getElementById('settings')!;
    this.fullScrnEl = document.getElementById('screen-size')!;
    this.store = Store.getInstance()

    this.init();
  }

  init(): void {
    (this.settingsEl.querySelector('#settings-icon') as HTMLElement).addEventListener('click', (ev: MouseEvent) => {
      this.settingsEl.classList.toggle('open');
    });

    this.fullScrnEl.addEventListener('click', (ev: MouseEvent) => {
      if (this.fullScrnEl.classList.contains('fullscreen-icon')) {
        this.fullScrnEl.classList.remove('fullscreen-icon');
        this.store.dispatch(Actions.changeCanvasSize('Desktop-wrapped'))
      } else {
        this.fullScrnEl.classList.add('fullscreen-icon');
        this.store.dispatch(Actions.changeCanvasSize('Fullscreen'))
      }
    });
  }

  static getInstance(): Menu {
    if (!Menu.instance) {
      Menu.instance = new Menu();
    }
    return Menu.instance;
  }
}
