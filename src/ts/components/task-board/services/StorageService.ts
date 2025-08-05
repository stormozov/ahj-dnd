import { ICardData, IColumnData } from '../shared/interface';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class StorageService {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private static readonly STORAGE_KEY = 'kanban-board-data';

  static saveColumn(columnData: IColumnData): void {
    const data = this.getAllData();
    const existingColumnIndex = data.findIndex(
      (col) => col.id === columnData.id
    );

    if (existingColumnIndex >= 0) {
      data[existingColumnIndex] = columnData;
    } else {
      data.push(columnData);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  static getColumn(columnId: string): IColumnData | null {
    const data = this.getAllData();
    return data.find((col) => col.id === columnId) || null;
  }

  static addCardToColumn(columnId: string, cardData: ICardData): void {
    // Получаем существующую колонку или создаем новую
    let column = this.getColumn(columnId);

    if (!column) {
      // Если колонка не существует, создаем её
      column = {
        id: columnId,
        title: '', // Заголовок будет установлен позже
        cards: [],
      };
    }

    // Добавляем новую карточку в массив
    column.cards.push(cardData);

    // Сохраняем обновленную колонку
    this.saveColumn(column);
  }

  static removeCardFromColumn(columnId: string, cardId: string): void {
    const column = this.getColumn(columnId);
    if (column) {
      column.cards = column.cards.filter((card) => card.id !== cardId);
      this.saveColumn(column);
    }
  }

  static updateColumnTitle(columnId: string, title: string): void {
    let column = this.getColumn(columnId);

    if (!column) {
      column = { id: columnId, title, cards: [] };
    } else {
      column.title = title;
    }

    this.saveColumn(column);
  }

  static getAllData(): IColumnData[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static clearAllData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
