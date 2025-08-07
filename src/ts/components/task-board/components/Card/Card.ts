import { ElementConfig } from '../../shared/interface';
import createElement from '../../utils/createElementFunction';

/**
 * Класс, представляющий карточку задачи.
 * Отвечает за хранение данных карточки и создание её DOM-представления.
 */
export default class Card {
  /**
   * Создает экземпляр карточки.
   *
   * @param {string} _id - Уникальный идентификатор карточки.
   * @param {string} _title - Заголовок карточки.
   * @param {string} _text - Текст карточки.
   */
  constructor(
    private readonly _id: string,
    private _title: string,
    private _text: string
  ) {}

  /**
   * Возвращает массив с информацией о карточке.
   *
   * @returns {string[]} Массив вида [id, title, text].
   */
  get info(): string[] {
    return [this._id, this._title, this._text];
  }

  /**
   * Возвращает идентификатор карточки.
   *
   * @returns {string} Уникальный идентификатор карточки.
   */
  get id(): string {
    return this._id;
  }

  /**
   * Возвращает заголовок карточки.
   *
   * @returns {string} Текущий заголовок карточки.
   */
  get title(): string {
    return this._title;
  }

  /**
   * Устанавливает новый заголовок карточки.
   *
   * @param {string} title - Новый заголовок карточки.
   */
  set title(title: string) {
    this._title = title;
  }

  /**
   * Возвращает текст карточки.
   *
   * @returns {string} Текущий текст карточки.
   */
  get text(): string {
    return this._text;
  }

  /**
   * Устанавливает новый текст карточки.
   *
   * @param {string} text - Новый текст карточки.
   */
  set text(text: string) {
    this._text = text;
  }

  /**
   * Создает DOM-элемент карточки.
   *
   * @returns {HTMLElement} DOM-элемент карточки.
   */
  createCardItem(): HTMLElement {
    return this._cardItemHandler();
  }

  /**
   * Возвращает конфигурацию для создания DOM-элемента карточки.
   *
   * @returns {ElementConfig} Конфигурация элемента карточки.
   */
  getCardConfig(): ElementConfig {
    return {
      tag: 'li',
      className: 'board__card',
      id: this.id,
      children: [
        {
          tag: 'div',
          className: 'board__card-body',
          children: [
            {
              tag: 'h3',
              className: 'board__card-title',
              text: this.title,
            },
            {
              tag: 'p',
              className: 'board__card-text',
              text: this.text,
            },
          ],
        },
        {
          tag: 'button',
          className: 'board__card-delete-btn',
          html: '&#10008;',
        },
      ],
    };
  }

  /**
   * Обработчик создания DOM-элемента карточки.
   *
   * @returns {HTMLElement} Созданный DOM-элемент карточки.
   * @private
   */
  private _cardItemHandler(): HTMLElement {
    return createElement(this.getCardConfig());
  }
}
