import { ICardData, IColumnData } from '../shared/interface';

/**
 * Сервис для работы с локальным хранилищем (localStorage).
 * Обеспечивает сохранение, загрузку и управление данными канбан-доски.
 * Все методы реализованы как статические, экземпляр класса не требуется.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class StorageService {
  /**
   * Ключ для хранения данных в localStorage.
   *
   * @private
   * @static
   * @readonly
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private static readonly STORAGE_KEY = 'kanban-board-data';

  /**
   * Сохраняет данные колонки в localStorage.
   * Если колонка с таким ID уже существует, обновляет её данные.
   *
   * @param {IColumnData} columnData - Данные колонки для сохранения.
   * @static
   */
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

  /**
   * Получает данные колонки по её ID.
   *
   * @param {string} columnId - ID колонки.
   * @returns {IColumnData | null} Данные колонки или null, если колонка не найдена.
   *
   * @static
   */
  static getColumn(columnId: string): IColumnData | null {
    const data = this.getAllData();
    return data.find((col) => col.id === columnId) || null;
  }

  /**
   * Добавляет карточку в указанную колонку.
   * Если колонка не существует, создаёт новую.
   *
   * @param {string} columnId - ID колонки.
   * @param {ICardData} cardData - Данные карточки.
   *
   * @static
   */
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

  /**
   * Удаляет карточку из колонки.
   *
   * @param {string} columnId - ID колонки.
   * @param {string} cardId - ID карточки.
   *
   * @static
   */
  static removeCardFromColumn(columnId: string, cardId: string): void {
    const column = this.getColumn(columnId);
    if (column) {
      column.cards = column.cards.filter((card) => card.id !== cardId);
      this.saveColumn(column);
    }
  }

  /**
   * Обновляет заголовок колонки.
   * Если колонка не существует, создаёт новую с указанным заголовком.
   *
   * @param {string} columnId - ID колонки.
   * @param {string} title - Новый заголовок колонки.
   *
   * @static
   */
  static updateColumnTitle(columnId: string, title: string): void {
    let column = this.getColumn(columnId);

    if (!column) {
      column = { id: columnId, title, cards: [] };
    } else {
      column.title = title;
    }

    this.saveColumn(column);
  }

  /**
   * Получает все данные канбан-доски из localStorage.
   *
   * @returns {IColumnData[]} Массив всех колонок с карточками.
   * @static
   */
  static getAllData(): IColumnData[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Очищает все данные канбан-доски из localStorage.
   * @static
   */
  static clearAllData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
