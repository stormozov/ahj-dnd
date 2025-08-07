import { IdGenerator } from '../../services/IdGenerator';
import { StorageService } from '../../services/StorageService';
import { ElementConfig, ICardData } from '../../shared/interface';
import { ColumnOrCardId } from '../../shared/types';
import createElement from '../../utils/createElementFunction';
import Card from '../Card/Card';
import { CardForm } from '../CardForm/CardForm';

/**
 * Класс, представляющий колонку на доске задач.
 * Отвечает за создание, отображение и управление карточками внутри колонки.
 */
export default class Column {
  /**
   * Уникальный идентификатор колонки.
   *
   * @readonly
   */
  public readonly _id: string;

  /**
   * Заголовок колонки.
   *
   * @private
   * @readonly
   */
  private readonly _title: string;

  /**
   * Карточки в колонке, хранящиеся в виде Map.
   * Ключ - идентификатор карточки, значение - объект с данными карточки.
   *
   * @private
   */
  private _cards: Map<string, { title: string; text: string }>;

  /**
   * Сервис для генерации идентификаторов.
   *
   * @private
   */
  private _idGeneratorService = IdGenerator.getInstance();

  /**
   * Текст кнопки добавления новой карточки.
   *
   * @private
   */
  private _addNewCardBtnText = '+ Добавить карточку';

  /**
   * DOM-элемент колонки.
   *
   * @private
   */
  private _columnElement: HTMLElement | null = null;

  /**
   * Создает экземпляр колонки.
   *
   * @param {string} title - Заголовок колонки.
   * @param {ColumnOrCardId} [id] - Необязательный идентификатор колонки.
   */
  constructor(title: string, id?: ColumnOrCardId) {
    this._id = this._generateColumnID(id);
    this._title = title;
    this._cards = new Map();

    this._loadCardsFromStorage();
  }

  /**
   * Возвращает массив идентификаторов карточек в колонке.
   *
   * @returns {string[]} Массив идентификаторов карточек.
   */
  get cards(): string[] {
    return [...this._cards.keys()];
  }

  /**
   * Возвращает заголовок колонки.
   *
   * @returns {string} Заголовок колонки.
   */
  get title(): string {
    return this._title;
  }

  /**
   * Добавляет новую карточку в колонку.
   *
   * @param {string} title - Заголовок карточки.
   * @param {string} text - Текст карточки.
   *
   * @returns {string} Идентификатор созданной карточки.
   */
  addCard(title: string, text: string): string {
    const cardId = this._idGeneratorService.generateCardId();
    this._cards.set(cardId, { title, text });

    return cardId;
  }

  /**
   * Создает DOM-элемент колонки.
   *
   * @param {string} title - Заголовок колонки.
   * @returns {HTMLElement} Созданный DOM-элемент колонки.
   */
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

  /**
   * Обновляет DOM колонки, перерисовывая все карточки.
   */
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

  /**
   * Создает конфигурацию для заголовка колонки.
   *
   * @param {string} title - Заголовок колонки.
   * @returns {ElementConfig} Конфигурация элемента заголовка.
   *
   * @private
   */
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

  /**
   * Создает конфигурацию для тела колонки.
   *
   * @returns {ElementConfig} Конфигурация элемента тела колонки.
   * @private
   */
  private _createColumnBody(): ElementConfig {
    return {
      tag: 'div',
      className: 'board__column-body',
      children: [this._createCardListElement()],
    };
  }

  /**
   * Создает конфигурацию для подвала колонки.
   *
   * @returns {ElementConfig} Конфигурация элемента подвала колонки.
   * @private
   */
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

  /**
   * Создает конфигурацию для списка карточек.
   *
   * @returns {ElementConfig} Конфигурация элемента списка карточек.
   * @private
   */
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

  /**
   * Добавляет обработчики событий к элементам колонки.
   *
   * @private
   */
  private _attachEventListeners(): void {
    if (!this._columnElement) return;

    this._attachAddCardButtonListener();
    this._attachDeleteCardListener();
  }

  /**
   * Добавляет обработчик события для кнопки добавления карточки.
   *
   * @private
   */
  private _attachAddCardButtonListener(): void {
    const addCardBtn = this._columnElement?.querySelector(
      '.board__column-add-card-btn'
    );
    if (addCardBtn) {
      addCardBtn.addEventListener('click', () => this._onAddCardClick());
    }
  }

  /**
   * Добавляет обработчик события для удаления карточки.
   *
   * @private
   */
  private _attachDeleteCardListener(): void {
    this._columnElement?.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('board__card-delete-btn')) {
        this._onDeleteCardClick(event);
      }
    });
  }

  /**
   * Обработчик клика по кнопке добавления карточки.
   *
   * @private
   */
  private _onAddCardClick(): void {
    this._toggleCardForm();
  }

  /**
   * Переключает отображение формы добавления карточки.
   *
   * @private
   */
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

  /**
   * Показывает форму для добавления новой карточки.
   *
   * @param {Element} columnBody - DOM-элемент тела колонки.
   * @private
   */
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

  /**
   * Добавляет карточку в DOM.
   *
   * @param {ICardData} cardData - Данные карточки.
   * @private
   */
  private _addCardToDOM(cardData: ICardData): void {
    const card = new Card(cardData.id, cardData.title, cardData.text);
    const cardElement = card.createCardItem();

    const cardList = this._columnElement?.querySelector('.board__card-list');
    if (cardList) {
      cardList.appendChild(cardElement);
    }
  }

  /**
   * Обработчик отправки формы добавления карточки.
   *
   * @param {string} title - Заголовок карточки.
   * @param {string} text - Текст карточки.
   *
   * @private
   */
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

  /**
   * Загружает карточки из хранилища.
   *
   * @private
   */
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

  /**
   * Генерирует идентификатор колонки.
   *
   * @param {ColumnOrCardId} id - Необязательный идентификатор колонки.
   * @returns {string} Сгенерированный идентификатор колонки.
   *
   * @private
   */
  private _generateColumnID(id: ColumnOrCardId | undefined): string {
    return id ? `column-${id}` : this._idGeneratorService.generateColumnId();
  }

  /**
   * Обработчик клика по кнопке удаления карточки.
   *
   * @param {Event} event - Событие клика.
   * @private
   */
  private _onDeleteCardClick(event: Event): void {
    const deleteBtn = event.target as HTMLElement;
    const cardElement = deleteBtn.closest('.board__card') as HTMLElement;

    if (!cardElement) return;

    const cardId = cardElement.id;

    // Удаляем карточку из localStorage
    StorageService.removeCardFromColumn(this._id, cardId);

    // Удаляем карточку из внутреннего Map
    this._cards.delete(cardId);

    // Удаляем карточку из DOM
    cardElement.remove();
  }
}
