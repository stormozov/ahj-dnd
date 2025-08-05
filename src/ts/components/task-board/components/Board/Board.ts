import { IColumnConfig } from '../../shared/interface';
import Column from '../Column/Column';

export default class Board {
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
}
