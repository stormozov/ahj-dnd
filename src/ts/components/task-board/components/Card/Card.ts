import { ElementConfig } from '../../shared/interface';
import createElement from '../../utils/createElementFunction';

export default class Card {
  constructor(
    private readonly _id: string,
    private _title: string,
    private _text: string
  ) {}

  // Геттеры и сеттеры
  get info(): string[] {
    return [this._id, this._title, this._text];
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get text(): string {
    return this._text;
  }

  set title(title: string) {
    this._title = title;
  }

  set text(text: string) {
    this._text = text;
  }

  // Методы
  createCardItem(): HTMLElement {
    return this._cardItemHandler();
  }

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

  private _cardItemHandler(): HTMLElement {
    return createElement(this.getCardConfig());
  }
}
