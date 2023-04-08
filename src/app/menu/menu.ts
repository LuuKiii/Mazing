export class Menu {
  private static instance: Menu;
  private settingsEl: HTMLElement;
  private fullScrnEl: HTMLElement;

  private constructor() {
    this.settingsEl = document.getElementById('settings')!;
    this.fullScrnEl = document.getElementById('screen-size')!;

    this.init();
  }

  init(): void {
    (this.settingsEl.querySelector('#settings-icon') as HTMLElement).addEventListener('click', (ev: MouseEvent) => {
      this.settingsEl.classList.toggle('open');
    });

    this.fullScrnEl.addEventListener('click', (ev: MouseEvent) => {
      this.fullScrnEl.classList.toggle('fullscreen-icon');
    });
  }

  static getInstance(): Menu {
    if (!Menu.instance) {
      Menu.instance = new Menu();
    }
    return Menu.instance;
  }
}
