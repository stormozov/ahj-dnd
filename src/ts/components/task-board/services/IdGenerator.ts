export class IdGenerator {
  private static _instance: IdGenerator;

  private constructor() {}

  static getInstance(): IdGenerator {
    if (!IdGenerator._instance) {
      IdGenerator._instance = new IdGenerator();
    }
    return IdGenerator._instance;
  }

  generateColumnId(): string {
    return `column-${this._generateUniqueId()}`;
  }

  generateCardId(): string {
    return `card-${this._generateUniqueId()}`;
  }

  private _generateUniqueId(): string {
    // Комбинируем timestamp и случайное число для большей уникальности
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
