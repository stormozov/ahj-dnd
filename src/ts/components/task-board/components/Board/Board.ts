import { DropAndDragService } from '../../services/DropAndDragService';
import { IColumnConfig } from '../../shared/interface';
import Column from '../Column/Column';

export default class Board {
  private _dndService: DropAndDragService | null = null;

  constructor(
    private _container: HTMLDivElement,
    private readonly _columnConfigs: IColumnConfig[]
  ) {}

  render(): void {
    const board = this.createBoardElement();
    const container = this.createBoardContainer();
    const columns = this.createColumnElements();

    container.append(...columns);
    board.append(container);

    this._container.append(board);

    // Инициализируем и включаем DnD после добавления элементов в DOM
    this._initDnDService(board);
  }

  createBoardElement(): HTMLDivElement {
    const board = document.createElement('div');
    board.classList.add('board');

    return board;
  }

  createBoardContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add('board__container');

    return container;
  }

  createColumns(): Column[] {
    return this._columnConfigs.map(
      (config) => new Column(config.title, config.id)
    );
  }

  createColumnElements(): HTMLElement[] {
    return this.createColumns().map((column) => {
      return column.createColumn(column.title);
    });
  }

  disableDnD(): void {
    if (this._dndService) {
      this._dndService.disable();
      this._dndService = null;
    }
  }

  enableDnD(): void {
    // Сначала отключаем, если уже был включен, чтобы избежать дублирования
    this.disableDnD();

    const boardElement = this._container.querySelector('.board');
    if (boardElement && boardElement instanceof HTMLDivElement) {
      this._initDnDService(boardElement);
    } else {
      console.error('Элемент доски не найден для включения DnD');
    }
  }

  private _initDnDService(boardElement: HTMLDivElement): void {
    // Создаем экземпляр сервиса, передавая ему контейнер доски
    this._dndService = new DropAndDragService(boardElement);

    // Включаем функционал Drag and Drop
    this._dndService.enable();
  }
}
