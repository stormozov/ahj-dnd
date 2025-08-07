/**
 * Класс для генерации уникальных идентификаторов.
 * Предоставляет методы для создания ID колонок и карточек.
 */
export class IdGenerator {
  /**
   * Единственный экземпляр класса IdGenerator.
   *
   * @private
   * @static
   */
  private static _instance: IdGenerator;

  /**
   * Приватный конструктор для реализации паттерна синглтон.
   * @private
   */
  private constructor() {}

  /**
   * Возвращает единственный экземпляр IdGenerator.
   * Если экземпляр не существует, создает новый.
   *
   * @static
   * @returns {IdGenerator} Экземпляр IdGenerator
   */
  static getInstance(): IdGenerator {
    if (!IdGenerator._instance) {
      IdGenerator._instance = new IdGenerator();
    }
    return IdGenerator._instance;
  }

  /**
   * Генерирует уникальный идентификатор для колонки.
   * @returns {string} Уникальный ID колонки в формате "column-<уникальный_идентификатор>"
   */
  generateColumnId(): string {
    return `column-${this._generateUniqueId()}`;
  }

  /**
   * Генерирует уникальный идентификатор для карточки.
   * @returns {string} Уникальный ID карточки в формате "card-<уникальный_идентификатор>"
   */
  generateCardId(): string {
    return `card-${this._generateUniqueId()}`;
  }

  /**
   * Генерирует уникальную строку идентификатора.
   * Использует timestamp и случайную строку для обеспечения уникальности.
   *
   * @private
   * @returns {string} Уникальная строка идентификатора
   */
  private _generateUniqueId(): string {
    // Комбинируем timestamp и случайное число для большей уникальности
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
