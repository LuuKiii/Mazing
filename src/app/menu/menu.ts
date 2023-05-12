import { Store } from "../state/store";
import { Actions } from "../state/actions";
import { GridConfigSettable } from "../core/grid/grid";

export class Menu {
  private static instance: Menu;
  private settingsEl: HTMLElement;
  private fullScrnEl: HTMLElement;
  private settingsBtns: ButtonsType;
  private settingsInputs: InputsType;
  private store: Store;

  private constructor() {
    this.settingsEl = document.getElementById('settings')!;
    this.fullScrnEl = document.getElementById('screen-size')!;
    this.store = Store.getInstance()

    this.settingsBtns = {
      clear: this.settingsEl.querySelector('#clear-btn')!,
      setStart: this.settingsEl.querySelector('#set-start-btn')!,
      setEnd: this.settingsEl.querySelector('#set-end-btn')!,
      resize: this.settingsEl.querySelector('#resize-btn')!,
      generate: this.settingsEl.querySelector('#generate-btn')!,
    }

    this.settingsInputs = {
      tileSize: this.settingsEl.querySelector('#tile-size')!,
      tileColumns: this.settingsEl.querySelector('#tile-cols')!,
      tileRows: this.settingsEl.querySelector('#tile-rows')!,
    }

    this.init();
  }

  private init(): void {
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

    this.settingsBtns.clear.addEventListener('click', (ev: MouseEvent) => {
      this.store.dispatch(Actions.gridClearAction())
    })

    this.settingsBtns.setStart.addEventListener('click', (ev: MouseEvent) => {
      this.closeMenu()
      this.store.dispatch(Actions.gridSetNextClickedButtonAsAction('start'))
    })

    this.settingsBtns.setEnd.addEventListener('click', (ev: MouseEvent) => {
      this.closeMenu()
      this.store.dispatch(Actions.gridSetNextClickedButtonAsAction('end'))
    })

    this.settingsBtns.resize.addEventListener('click', (ev: MouseEvent) => {
      this.closeMenu();
      const gridConfig: GridConfigSettable = {
        tileSize: typeof +this.settingsInputs.tileSize.value === 'string' ? undefined : +this.settingsInputs.tileSize.value,
        tileRows: typeof +this.settingsInputs.tileRows.value === 'string' ? undefined : +this.settingsInputs.tileRows.value,
        tileColumns: typeof +this.settingsInputs.tileColumns.value === 'string' ? undefined : +this.settingsInputs.tileColumns.value,
      }
      this.store.dispatch(Actions.gridResize(gridConfig))
    })

    this.settingsBtns.generate.addEventListener('click', (ev: MouseEvent) => {
      this.closeMenu();
      this.store.dispatch(Actions.gridGenerate())
    })
  }

  closeMenu(): void {
    this.settingsEl.classList.remove('open')
  }

  openMenu(): void {
    this.settingsEl.classList.add('open')
  }

  static getInstance(): Menu {
    if (!Menu.instance) {
      Menu.instance = new Menu();
    }
    return Menu.instance;
  }
}

type ButtonsType = {
  clear: HTMLButtonElement,
  setStart: HTMLButtonElement,
  setEnd: HTMLButtonElement,
  resize: HTMLButtonElement,
  generate: HTMLButtonElement,
}

type InputsType = {
  tileSize: HTMLInputElement,
  tileRows: HTMLInputElement,
  tileColumns: HTMLInputElement,
}
