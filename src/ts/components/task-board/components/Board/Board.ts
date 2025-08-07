import { DropAndDragService } from '../../services/DropAndDragService';
import { IColumnConfig } from '../../shared/interface';
import Column from '../Column/Column';

/**
 * Класс, представляющий доску с колонками задач.
 * Управляет отображением колонок и функционалом Drag-and-Drop.
 */
export default class Board {
  /**
   * Сервис для реализации Drag-and-Drop функционала.
   *
   * @private
   */
  private _dndService: DropAndDragService | null = null;

  /**
   * Создает экземпляр доски.
   *
   * @param {HTMLDivElement} _container - DOM-элемент-контейнер для доски.
   * @param {IColumnConfig[]} _columnConfigs - Конфигурации колонок доски.
   */
  constructor(
    private _container: HTMLDivElement,
    private readonly _columnConfigs: IColumnConfig[]
  ) {}

  /**
   * Отрисовывает доску в переданном контейнере.
   * Создает DOM-структуру доски, колонок и инициализирует DnD функционал.
   */
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

  /**
   * Создает DOM-элемент доски.
   *
   * @returns {HTMLDivElement} Созданный элемент доски.
   */
  createBoardElement(): HTMLDivElement {
    const board = document.createElement('div');
    board.classList.add('board');

    return board;
  }

  /**
   * Создает контейнер для колонок доски.
   *
   * @returns {HTMLDivElement} Созданный контейнер колонок.
   */
  createBoardContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add('board__container');

    return container;
  }

  /**
   * Создает экземпляры колонок на основе конфигурации.
   *
   * @returns {Column[]} Массив созданных колонок.
   */
  createColumns(): Column[] {
    return this._columnConfigs.map(
      (config) => new Column(config.title, config.id)
    );
  }

  /**
   * Создает DOM-элементы колонок.
   *
   * @returns {HTMLElement[]} Массив DOM-элементов колонок.
   */
  createColumnElements(): HTMLElement[] {
    return this.createColumns().map((column) => {
      return column.createColumn(column.title);
    });
  }

  /**
   * Отключает функционал Drag-and-Drop для доски.
   */
  disableDnD(): void {
    if (this._dndService) {
      this._dndService.disable();
      this._dndService = null;
    }
  }

  /**
   * Включает функционал Drag-and-Drop для доски.
   * Если DnD уже был включен, сначала отключает его.
   */
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

  /**
   * Инициализирует сервис Drag-and-Drop.
   *
   * @param {HTMLDivElement} boardElement - DOM-элемент доски.
   * @private
   */
  private _initDnDService(boardElement: HTMLDivElement): void {
    // Создаем экземпляр сервиса, передавая ему контейнер доски
    this._dndService = new DropAndDragService(boardElement);

    // Включаем функционал Drag and Drop
    this._dndService.enable();
  }
}
