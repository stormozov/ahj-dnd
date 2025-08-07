import { IDragState } from '../shared/interface';
import { StorageService } from './StorageService';

/**
 * Сервис для реализации функционала Drag-and-Drop (перетаскивания) карточек между колонками.
 * Управляет всем процессом перетаскивания: от начала до завершения, включая обновление DOM и хранилища.
 */
export class DropAndDragService {
  /**
   * Контейнер доски, на котором будут обрабатываться события.
   *
   * @private
   * @readonly
   */
  private readonly _boardContainer: HTMLElement;

  /**
   * Текущее состояние перетаскивания.
   * @private
   */
  private _dragState: IDragState = {
    isDragging: false,
    draggedElement: null,
    placeholder: null,
    originalColumn: null,
    originalColumnId: '',
    originalIndex: -1,
    currentColumn: null,
    originalWidth: 0,
    offsetX: 0,
    offsetY: 0,
  };

  /**
   * CSS-класс, применяемый к перетаскиваемому элементу.
   *
   * @static
   * @readonly
   */
  static readonly DRAGGING_CLASS = 'board__card--dragging';

  /**
   * Создает экземпляр сервиса Drag-and-Drop.
   *
   * @param {HTMLElement} boardContainer - DOM-элемент контейнера доски.
   */
  constructor(boardContainer: HTMLElement) {
    this._boardContainer = boardContainer;
    this._init();
  }

  /**
   * Включает функционал Drag-and-Drop.
   * В текущей реализации сервис включается автоматически при создании.
   */
  enable(): void {
    // Сервис уже включен в конструкторе
  }

  /**
   * Отключает функционал Drag-and-Drop.
   * Удаляет все обработчики событий и сбрасывает состояние.
   */
  disable(): void {
    this._cleanup();
    // Удаляем основной обработчик
    this._boardContainer.removeEventListener(
      'mousedown',
      this._handleMouseDown.bind(this)
    );
  }

  /**
   * Инициализирует сервис, добавляя обработчики событий.
   * @private
   */
  private _init(): void {
    // Используем делегирование событий на уровне контейнера доски
    this._boardContainer.addEventListener(
      'mousedown',
      this._handleMouseDown.bind(this)
    );
  }

  /**
   * Обработчик события нажатия кнопки мыши.
   * Начинает процесс перетаскивания, если клик был по карточке.
   *
   * @param {MouseEvent} event - Событие мыши.
   * @private
   */
  private _handleMouseDown(event: MouseEvent): void {
    if (event.button !== 0) return;

    const target = event.target as HTMLElement;

    if (target.closest('.board__card-delete-btn')) return;

    // Проверяем, кликнули ли по карточке
    const card = (event.target as HTMLElement).closest('.board__card');
    if (!card) return;

    const column = card.closest('.board__column');
    if (!column) return;

    // Предотвращаем стандартное поведение сразу
    event.preventDefault();

    // Сохраняем состояние для начала перетаскивания
    const rect = card.getBoundingClientRect();

    const originalWidth = rect.width;

    this._dragState = {
      isDragging: true,
      draggedElement: card as HTMLElement,
      placeholder: this._createPlaceholder(card as HTMLElement),
      originalColumn: column as HTMLElement,
      originalColumnId: column.id,
      originalIndex: Array.from(
        column.querySelectorAll('.board__card')
      ).indexOf(card as HTMLElement),
      currentColumn: column as HTMLElement,
      originalWidth,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };

    // Применяем стили к перетаскиваемому элементу
    this._applyDragStyles();

    // Добавляем глобальные обработчики
    document.addEventListener('mousemove', this._handleMouseMove.bind(this));
    document.addEventListener('mouseup', this._handleMouseUp.bind(this));

    // Предотвращаем выделение текста
    this._preventTextSelection(true);
  }

  /**
   * Обработчик события перемещения мыши.
   * Управляет перемещением карточки и обновлением placeholder'а.
   *
   * @param {MouseEvent} event - Событие мыши.
   * @private
   */
  private _handleMouseMove(event: MouseEvent): void {
    if (!this._dragState.isDragging || !this._dragState.draggedElement) return;

    event.preventDefault();
    event.stopPropagation();

    // Перемещаем карточку
    this._moveDraggedElement(event);

    // Определяем, над какой колонкой находится курсор
    const elementUnderCursor = document.elementFromPoint(
      event.clientX,
      event.clientY
    );
    const newColumn = elementUnderCursor?.closest('.board__column');

    if (newColumn && newColumn instanceof HTMLElement) {
      this._dragState.currentColumn = newColumn;
      this._updatePlaceholderPosition(event);
    }
  }

  /**
   * Обработчик события отпускания кнопки мыши.
   * Завершает процесс перетаскивания и обновляет DOM и хранилище.
   *
   * @param {MouseEvent} event - Событие мыши.
   * @private
   */
  private _handleMouseUp(event: MouseEvent): void {
    if (!this._dragState.isDragging) return;

    event.preventDefault();
    event.stopPropagation();

    this._finishDragging();

    this._cleanup();
  }

  /**
   * Перемещает перетаскиваемый элемент в соответствии с положением мыши.
   *
   * @param {MouseEvent} event - Событие мыши.
   * @private
   */
  private _moveDraggedElement(event: MouseEvent): void {
    if (!this._dragState.draggedElement) return;

    this._dragState.draggedElement.style.left = `${event.clientX - this._dragState.offsetX}px`;
    this._dragState.draggedElement.style.top = `${event.clientY - this._dragState.offsetY}px`;
  }

  /**
   * Обновляет позицию placeholder'а в зависимости от положения мыши.
   *
   * @param {MouseEvent} event - Событие мыши.
   * @private
   */
  private _updatePlaceholderPosition(event: MouseEvent): void {
    if (
      !this._dragState.currentColumn ||
      !this._dragState.placeholder ||
      !this._dragState.draggedElement
    ) {
      return;
    }

    const cardList =
      this._dragState.currentColumn.querySelector('.board__card-list');
    if (!cardList) return;

    // Удаляем placeholder из текущего положения
    if (this._dragState.placeholder.parentNode) {
      this._dragState.placeholder.remove();
    }

    // Находим все карточки в колонке, кроме перетаскиваемой
    const cards = Array.from(
      cardList.querySelectorAll(
        '.board__card:not(#' + this._dragState.draggedElement.id + ')'
      )
    ) as HTMLElement[];

    let insertBeforeElement: Node | null = null;

    // Определяем позицию вставки
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      if (event.clientY < rect.top + rect.height / 2) {
        insertBeforeElement = card;
        break;
      }
    }

    // Вставляем placeholder
    cardList.insertBefore(this._dragState.placeholder, insertBeforeElement);
  }

  /**
   * Завершает процесс перетаскивания, вставляя карточку на новое место.
   * @private
   */
  private _finishDragging(): void {
    if (
      !this._dragState.draggedElement ||
      !this._dragState.placeholder ||
      !this._dragState.currentColumn
    ) {
      return;
    }

    try {
      const targetCardList =
        this._dragState.currentColumn.querySelector('.board__card-list');
      const targetColumnId = this._dragState.currentColumn.id;

      if (targetCardList) {
        // Определяем newIndex ДО удаления placeholder'а
        let newIndex = -1;

        if (this._dragState.placeholder.parentNode === targetCardList) {
          // Placeholder находится в той же колонке (перемещение внутри колонки) или в целевой колонке
          const cardsInList = Array.from(targetCardList.children);
          newIndex = cardsInList.indexOf(this._dragState.placeholder);
          // Если placeholder не найден (например, вставлен в конец), newIndex останется -1
        }

        // Удаляем оригинальную карточку из DOM
        this._dragState.draggedElement.remove();

        // Вставляем карточку на место placeholder
        targetCardList.insertBefore(
          this._dragState.draggedElement,
          this._dragState.placeholder
        );

        // Обновляем localStorage, передав вычисленный newIndex
        this._updateLocalStorage(targetColumnId, newIndex);
      }
    } catch (error) {
      console.error('Ошибка при завершении перетаскивания:', error);
    }
  }

  /**
   * Обновляет данные в localStorage после перетаскивания карточки.
   *
   * @param {string} targetColumnId - ID целевой колонки.
   * @param {number} [newIndex=-1] - Новая позиция карточки в колонке.
   *
   * @private
   */
  private _updateLocalStorage(
    targetColumnId: string,
    newIndex: number = -1
  ): void {
    try {
      const cardId = this._dragState.draggedElement?.id;
      if (!cardId) return;

      // Получаем оригинальную колонку
      const originalColumnData = StorageService.getColumn(
        this._dragState.originalColumnId
      );
      if (!originalColumnData) return;

      // Находим карточку в оригинальной колонке
      const cardIndex = originalColumnData.cards.findIndex(
        (card) => card.id === cardId
      );
      if (cardIndex === -1) return;

      // Извлекаем данные карточки
      const [cardData] = originalColumnData.cards.splice(cardIndex, 1);

      // Если перемещение внутри колонки
      if (this._dragState.originalColumnId === targetColumnId) {
        // Если newIndex не был передан или недействителен, рассчитываем как раньше (на случай сбоя)
        if (newIndex === -1) {
          console.warn(
            'newIndex не был передан для перемещения внутри колонки, используется резервный расчет.'
          );

          newIndex = originalColumnData.cards.length;

          // Этот резервный расчет всё ещё может быть неточным, но лучше, чем ничего
          if (this._dragState.currentColumn && this._dragState.placeholder) {
            const cardList =
              this._dragState.currentColumn.querySelector('.board__card-list');
            if (cardList) {
              // Placeholder уже удален, поэтому этот блок может не сработать корректно.
              // Лучше полагаться на newIndex, переданный из _finishDragging.
              const cards = Array.from(cardList.children);
              newIndex = cards.indexOf(this._dragState.placeholder);
              if (newIndex === -1) newIndex = originalColumnData.cards.length;
            }
          }
        }

        // Вставляем карточку в новую позицию
        originalColumnData.cards.splice(newIndex, 0, cardData);
        StorageService.saveColumn(originalColumnData);
      } else {
        // Если перемещение между колонками
        // Сохраняем обновленную оригинальную колонку (без карточки)
        StorageService.saveColumn(originalColumnData);
        // Обновляем columnId у карточки
        cardData.columnId = targetColumnId;

        // Получаем целевую колонку
        let targetColumnData = StorageService.getColumn(targetColumnId);
        if (!targetColumnData) {
          targetColumnData = { id: targetColumnId, title: '', cards: [] };
        }

        // Если перемещение в другую колонку, newIndex определяет позицию вставки в новой колонке.
        // Если newIndex -1 (например, вставлен в конец), вставляем в конец.
        if (newIndex === -1 || newIndex > targetColumnData.cards.length) {
          newIndex = targetColumnData.cards.length;
        }

        // Вставляем карточку в целевую колонку
        targetColumnData.cards.splice(newIndex, 0, cardData);
        StorageService.saveColumn(targetColumnData);
      }
    } catch (error) {
      console.error('Ошибка при обновлении localStorage:', error);
    }
  }

  /**
   * Создает placeholder для перетаскиваемой карточки.
   *
   * @param {HTMLElement} cardElement - DOM-элемент карточки.
   * @returns {HTMLElement} Созданный placeholder.
   *
   * @private
   */
  private _createPlaceholder(cardElement: HTMLElement): HTMLElement {
    const placeholder = document.createElement('li');
    placeholder.className = 'board__card-placeholder';
    placeholder.style.height = `${cardElement.offsetHeight}px`;

    return placeholder;
  }

  /**
   * Применяет стили к перетаскиваемому элементу.
   *
   * @private
   */
  private _applyDragStyles(): void {
    if (!this._dragState.draggedElement) return;

    this._dragState.draggedElement.classList.add(
      DropAndDragService.DRAGGING_CLASS
    );

    this._dragState.draggedElement.style.width = `${this._dragState.originalWidth}px`;

    this._dragState.draggedElement.style.position = 'fixed';

    document.body.style.cursor = 'grabbing';

    // Инициализируем позицию placeholder
    this._updatePlaceholderPosition({
      clientX: 0,
      clientY: 0,
    } as MouseEvent);
  }

  /**
   * Включает/выключает выделение текста на странице.
   *
   * @param {boolean} prevent - Если true, выделение текста будет отключено.
   * @private
   */
  private _preventTextSelection(prevent: boolean): void {
    if (prevent) {
      document.body.style.userSelect = 'none';
      // Удаляем любое существующее выделение
      if (window.getSelection) window.getSelection()?.removeAllRanges();
    } else {
      document.body.style.userSelect = '';
    }
  }

  /**
   * Очищает состояние сервиса после завершения перетаскивания.
   * Удаляет обработчики событий, сбрасывает стили и состояние.
   *
   * @private
   */
  private _cleanup(): void {
    // Удаляем обработчики событий
    document.removeEventListener('mousemove', this._handleMouseMove.bind(this));
    document.removeEventListener('mouseup', this._handleMouseUp.bind(this));

    // Сбрасываем стили
    if (this._dragState.draggedElement) {
      // Удаляем класс перетаскивания
      this._dragState.draggedElement.classList.remove(
        DropAndDragService.DRAGGING_CLASS
      );

      // Сбрасываем динамически установленные стили
      this._dragState.draggedElement.style.position = '';
      this._dragState.draggedElement.style.left = '';
      this._dragState.draggedElement.style.top = '';
      this._dragState.draggedElement.style.width = ''; // Сбрасываем ширину
    }

    // Удаляем placeholder
    if (this._dragState.placeholder) {
      this._dragState.placeholder.remove();
    }

    // Восстанавливаем выделение текста
    this._preventTextSelection(false);

    // Сбрасываем курсор
    document.body.style.cursor = '';

    // Сбрасываем состояние
    this._dragState = {
      isDragging: false,
      draggedElement: null,
      placeholder: null,
      originalColumn: null,
      originalColumnId: '',
      originalIndex: -1,
      currentColumn: null,
      originalWidth: 0,
      offsetX: 0,
      offsetY: 0,
    };
  }
}
