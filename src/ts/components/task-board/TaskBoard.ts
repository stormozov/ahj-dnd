import Board from './components/Board/Board';

/**
 * Класс, представляющий доску задач (канбан-доску).
 * Инициализирует и управляет отображением доски с колонками задач.
 */
export default class TaskBoard {
  /**
   * DOM-элемент контейнера для доски.
   * @private
   */
  private _container: HTMLDivElement;

  /**
   * Конфигурации колонок доски по умолчанию.
   * Содержит предустановленные колонки: "К выполнению", "В работе", "Выполнено".
   *
   * @private
   * @readonly
   */
  private readonly _columnConfigs = [
    { id: 'todo', title: 'К выполнению' },
    { id: 'in-progress', title: 'В работе' },
    { id: 'done', title: 'Выполнено' },
  ];

  /**
   * Экземпляр доски, управляющий колонками и карточками.
   * @private
   */
  private _board: Board;

  /**
   * Создает экземпляр доски задач.
   * @param {HTMLDivElement} container - DOM-элемент, в который будет вставлена доска.
   */
  constructor(container: HTMLDivElement) {
    this._container = container;
    this._board = new Board(this._container, this._columnConfigs);
  }

  /**
   * Инициализирует доску задач.
   * Вызывает отрисовку доски в переданном контейнере.
   */
  init(): void {
    this._renderBoard();
  }

  /**
   * Отрисовывает доску в контейнере.
   * @private
   */
  private _renderBoard(): void {
    this._board.render();
  }
}
