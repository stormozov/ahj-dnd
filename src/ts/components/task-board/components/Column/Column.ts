import { ColumnOrCardId } from '../../shared/types';
import { IdGenerator } from '../../services/IdGenerator';
import Card from '../Card/Card';
import createElement from '../../utils/createElementFunction';
import { ElementConfig, ICardData } from '../../shared/interface';
import { CardForm } from '../CardForm/CardForm';
import { StorageService } from '../../services/StorageService';

export default class Column {
  public readonly _id: string;

  private readonly _title: string;
  private _cards: Map<string, { title: string; text: string }>;
  private _idGeneratorService = IdGenerator.getInstance();
  private _addNewCardBtnText = '+ Добавить карточку';
  private _columnElement: HTMLElement | null = null;

  constructor(title: string, id?: ColumnOrCardId) {
    this._id = this._generateColumnID(id);
    this._title = title;
    this._cards = new Map();

    this._loadCardsFromStorage();
  }

  get cards(): string[] {
    return [...this._cards.keys()];
  }

  get title(): string {
    return this._title;
  }

  addCard(title: string, text: string): string {
    const cardId = this._idGeneratorService.generateCardId();
    this._cards.set(cardId, { title, text });

    return cardId;
  }

  createColumn(title: string): HTMLElement {
    this._columnElement = createElement({
      tag: 'div',
      className: 'board__column',
      id: this._id,
      children: [
        this._createColumnHeader(title),
        this._createColumnBody(),
        this._createColumnFooter(),
      ],
    });

    // Добавляем обработчики событий после создания элемента
    setTimeout(() => this._attachEventListeners(), 0);

    return this._columnElement;
  }

  refreshColumnDOM(): void {
    if (!this._columnElement) return;

    const cardList = this._columnElement.querySelector('.board__card-list');
    if (cardList) {
      // Очищаем текущий список
      cardList.innerHTML = '';

      // Добавляем все карточки из Map
      this._cards.forEach((cardData, cardId) => {
        const card = new Card(cardId, cardData.title, cardData.text);
        cardList.appendChild(card.createCardItem());
      });
    }
  }

  private _createColumnHeader(title: string): ElementConfig {
    return {
      tag: 'header',
      className: 'board__column-header',
      children: [
        {
          tag: 'h2',
          className: 'board__column-title',
          text: title,
        },
        {
          tag: 'button',
          className: 'board__column-dropdown-btn',
          children: [
            {
              tag: 'div',
              className: 'board__column-dropdown-icon',
            },
          ],
        },
      ],
    };
  }

  private _createColumnBody(): ElementConfig {
    return {
      tag: 'div',
      className: 'board__column-body',
      children: [this._createCardListElement()],
    };
  }

  private _createColumnFooter(): ElementConfig {
    return {
      tag: 'footer',
      className: 'board__column-footer',
      children: [
        {
          tag: 'button',
          className: 'board__column-add-card-btn',
          text: this._addNewCardBtnText,
          attrs: {
            type: 'button',
          },
        },
      ],
    };
  }

  private _createCardListElement(): ElementConfig {
    const cardElements: ElementConfig[] = [];

    // Добавляем существующие карточки
    this._cards.forEach((cardData, cardId) => {
      const card = new Card(cardId, cardData.title, cardData.text);
      cardElements.push(card.getCardConfig());
    });

    return {
      tag: 'ul',
      className: 'board__card-list',
      children: cardElements,
    };
  }

  private _attachEventListeners(): void {
    if (!this._columnElement) return;

    const addCardBtn = this._columnElement.querySelector(
      '.board__column-add-card-btn'
    );
    if (addCardBtn) {
      addCardBtn.addEventListener('click', () => this._onAddCardClick());
    }
  }

  private _onAddCardClick(): void {
    this._toggleCardForm();
  }

  private _toggleCardForm(): void {
    const columnBody = this._columnElement?.querySelector(
      '.board__column-body'
    );
    if (!columnBody) return;

    // Проверяем, есть ли уже форма
    const existingForm = columnBody.querySelector('.card-form');

    if (existingForm) {
      existingForm.remove();
    } else {
      // Если формы нет - создаем и показываем
      this._showCardForm(columnBody);
    }
  }

  private _showCardForm(columnBody: Element): void {
    const cardForm = new CardForm({
      columnId: this._id,
      onSubmit: (title, text): void => this._onFormSubmit(title, text),
      onCancel: (): void => this._toggleCardForm(),
    });

    // Вставляем форму после списка карточек
    const cardList = columnBody.querySelector('.board__card-list');
    if (cardList) {
      columnBody.insertBefore(cardForm.element, cardList.nextSibling);
    } else {
      columnBody.appendChild(cardForm.element);
    }
  }

  private _addCardToDOM(cardData: ICardData): void {
    const card = new Card(cardData.id, cardData.title, cardData.text);
    const cardElement = card.createCardItem();

    const cardList = this._columnElement?.querySelector('.board__card-list');
    if (cardList) {
      cardList.appendChild(cardElement);
    }
  }

  private _onFormSubmit(title: string, text: string): void {
    // Создаем новую карточку
    const cardId = this._idGeneratorService.generateCardId();

    // Сохраняем в localStorage
    const cardData: ICardData = {
      id: cardId,
      title,
      text,
      columnId: this._id,
    };

    StorageService.addCardToColumn(this._id, cardData);

    // Добавляем карточку в внутренний Map
    this._cards.set(cardId, { title, text });

    // Создаем и добавляем карточку в DOM
    this._addCardToDOM(cardData);

    // Закрываем форму
    this._toggleCardForm();
  }

  private _loadCardsFromStorage(): void {
    const columnData = StorageService.getColumn(this._id);
    if (columnData && columnData.cards.length > 0) {
      // Заполняем внутренний Map данными из localStorage
      columnData.cards.forEach((cardData) => {
        this._cards.set(cardData.id, {
          title: cardData.title,
          text: cardData.text,
        });
      });
    }
  }

  private _generateColumnID(id: ColumnOrCardId | undefined): string {
    return id ? `column-${id}` : this._idGeneratorService.generateColumnId();
  }
}
