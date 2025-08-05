import Board from './components/Board/Board';

export default class TaskBoard {
  private _container: HTMLDivElement;
  private readonly _columnConfigs = [
    { id: 'todo', title: 'К выполнению' },
    { id: 'in-progress', title: 'В работе' },
    { id: 'done', title: 'Выполнено' },
  ];
  private _board: Board;

  constructor(container: HTMLDivElement) {
    this._container = container;
    this._board = new Board(this._container, this._columnConfigs);
  }

  init(): void {
    this._renderBoard();
  }

  private _renderBoard(): void {
    this._board.render();
  }
}
