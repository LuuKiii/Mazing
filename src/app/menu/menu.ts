export class Menu {
  private static instance: Menu;
  private element: HTMLElement;

  private constructor() {
    this.element = document.getElementById('menu')!;

    this.init();
  }

  init(): void {
    (this.element.querySelector('#menu-icon') as HTMLElement).addEventListener('click', (ev: MouseEvent) => {
      this.element.classList.toggle('open');
    });
  }

  static getInstance(): Menu {
    if (!Menu.instance) {
      Menu.instance = new Menu();
    }
    return Menu.instance;
  }
}
