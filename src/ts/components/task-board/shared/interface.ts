/**
 * Опции для создания DOM-элемента.
 * Используется в функции createElement для гибкого создания элементов.
 */
export interface ICreateElementOptions {
  /**
   * Тег создаваемого элемента
   */
  tag?: string;

  /**
   * CSS-класс(ы) элемента
   */
  className?: string | string[];

  /**
   * ID элемента
   */
  id?: string;

  /**
   * Текстовое содержимое элемента
   */
  text?: string;

  /**
   * HTML-содержимое элемента
   */
  html?: string;

  /**
   * Атрибуты элемента в виде объекта {ключ: значение}
   */
  attrs?: Record<string, string>;

  /**
   * Дочерние элементы (DOM-элементы, строки или конфиги элементов)
   */
  children?: (HTMLElement | string | ElementConfig)[];

  /**
   * Родительский элемент, к которому будет добавлен созданный элемент
   */
  parent?: HTMLElement;
}

/**
 * Тип конфигурации элемента (аналог ICreateElementOptions)
 */
export type ElementConfig = ICreateElementOptions;

/**
 * Данные карточки задачи
 */
export interface ICardData {
  /**
   * Уникальный идентификатор карточки
   */
  id: string;

  /**
   * Заголовок карточки
   */
  title: string;

  /**
   * Текст карточки
   */
  text: string;

  /**
   * ID колонки, к которой принадлежит карточка
   */
  columnId: string;
}

/**
 * Данные колонки канбан-доски
 */
export interface IColumnData {
  /**
   * Уникальный идентификатор колонки
   */
  id: string;

  /**
   * Заголовок колонки
   */
  title: string;

  /**
   * Массив карточек в колонке
   */
  cards: ICardData[];
}

/**
 * Опции для формы создания/редактирования карточки
 */
export interface ICardFormOptions {
  /**
   * ID колонки, к которой будет принадлежать карточка
   */
  columnId: string;

  /**
   * Колбэк при отправке формы
   *
   * @param title - заголовок карточки
   * @param text - текст карточки
   */
  onSubmit: (title: string, text: string) => void;

  /**
   * Колбэк при отмене создания/редактирования
   */
  onCancel: () => void;
}

/**
 * Конфигурация колонки
 */
export interface IColumnConfig {
  /**
   * Уникальный идентификатор колонки
   */
  id: string;

  /**
   * Заголовок колонки
   */
  title: string;
}

/**
 * Позиция элемента на плоскости
 */
export interface IPosition {
  /**
   * Координата по оси X
   */
  x: number;

  /**
   * Координата по оси Y
   */
  y: number;
}

/**
 * Состояние перетаскивания (Drag-and-Drop)
 */
export interface IDragState {
  /**
   * Флаг активности перетаскивания
   */
  isDragging: boolean;

  /**
   * Перетаскиваемый DOM-элемент
   */
  draggedElement: HTMLElement | null;

  /**
   * DOM-элемент-заглушка (placeholder)
   */
  placeholder: HTMLElement | null;

  /**
   * Исходная колонка, из которой начато перетаскивание
   */
  originalColumn: HTMLElement | null;

  /**
   * ID исходной колонки
   */
  originalColumnId: string;

  /**
   * Исходный индекс карточки в колонке
   */
  originalIndex: number;

  /**
   * Текущая колонка, над которой находится перетаскиваемый элемент
   */
  currentColumn: HTMLElement | null;

  /**
   * Исходная ширина перетаскиваемого элемента
   */
  originalWidth: number;

  /**
   * Смещение по оси X относительно начала элемента
   */
  offsetX: number;

  /**
   * Смещение по оси Y относительно начала элемента
   */
  offsetY: number;
}
