import { ElementConfig, ICardFormOptions } from '../../shared/interface';
import createElement from '../../utils/createElementFunction';

/**
 * Класс формы для создания/редактирования карточек задач.
 * Управляет отображением формы, валидацией и обработкой событий.
 */
export class CardForm {
  /**
   * DOM-элемент формы.
   * @private
   */
  private _element: HTMLElement;

  /**
   * Опции формы (колбэки и параметры).
   * @private
   */
  private _options: ICardFormOptions;

  /**
   * Поле ввода заголовка карточки.
   * @private
   */
  private _titleInput!: HTMLInputElement;

  /**
   * Поле ввода текста карточки.
   * @private
   */
  private _textInput!: HTMLTextAreaElement;

  /**
   * Кнопка отправки формы.
   * @private
   */
  private _submitBtn!: HTMLButtonElement;

  /**
   * Счетчик символов для заголовка.
   * @private
   */
  private _titleCounter!: HTMLElement;

  /**
   * Счетчик символов для текста.
   * @private
   */
  private _textCounter!: HTMLElement;

  /**
   * Максимальная длина заголовка карточки.
   * @private
   * @readonly
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private readonly TITLE_MAX_LENGTH = 70;

  /**
   * Максимальная длина текста карточки.
   * @private
   * @readonly
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private readonly TEXT_MAX_LENGTH = 250;

  /**
   * Создает экземпляр формы карточки.
   * @param {ICardFormOptions} options - Опции формы (колбэки и параметры).
   */
  constructor(options: ICardFormOptions) {
    this._element = this._createForm();
    this._options = options;

    this._bindEvents();
    this._updateSubmitButtonState();
  }

  /**
   * Возвращает DOM-элемент формы.
   * @returns {HTMLElement} Элемент формы.
   */
  get element(): HTMLElement {
    return this._element;
  }

  /**
   * Возвращает опции формы.
   * @returns {ICardFormOptions} Текущие опции формы.
   */
  get options(): ICardFormOptions {
    return this._options;
  }

  /**
   * Создает DOM-структуру формы.
   *
   * @returns {HTMLElement} Созданный элемент формы.
   * @private
   */
  private _createForm(): HTMLElement {
    return createElement({
      tag: 'form',
      className: 'card-form',
      attrs: {
        novalidate: 'true',
      },
      children: [
        {
          tag: 'h3',
          className: 'card-form__title',
          text: 'Добавить новую карточку',
        },
        this._createTitleField(),
        this._createDescriptionField(),
        this._createActions(),
      ],
    });
  }

  /**
   * Создает конфигурацию для поля заголовка.
   *
   * @returns {ElementConfig} Конфигурация поля заголовка.
   * @private
   */
  private _createTitleField(): ElementConfig {
    const id = `card-title-${Date.now()}`;
    return {
      tag: 'div',
      className: 'card-form__field-group',
      children: [
        {
          tag: 'label',
          className: 'card-form__label',
          text: 'Заголовок',
          attrs: { for: id },
        },
        {
          tag: 'div',
          className: 'card-form__input-wrapper',
          children: [
            {
              tag: 'input',
              className: 'card-form__input card-form__input--title',
              attrs: {
                type: 'text',
                placeholder: 'Введите заголовок задачи',
                maxlength: this.TITLE_MAX_LENGTH.toString(),
                id,
              },
            },
            {
              tag: 'div',
              className: 'card-form__counter',
              text: `0/${this.TITLE_MAX_LENGTH}`,
            },
          ],
        },
      ],
    };
  }

  /**
   * Создает конфигурацию для поля описания.
   *
   * @returns {ElementConfig} Конфигурация поля описания.
   * @private
   */
  private _createDescriptionField(): ElementConfig {
    const id = `card-text-${Date.now()}`;
    return {
      tag: 'div',
      className: 'card-form__field-group',
      children: [
        {
          tag: 'label',
          className: 'card-form__label',
          text: 'Описание',
          attrs: { for: id },
        },
        {
          tag: 'div',
          className: 'card-form__input-wrapper',
          children: [
            {
              tag: 'textarea',
              className: 'card-form__textarea card-form__input--text',
              attrs: {
                placeholder: 'Введите текст задачи',
                maxlength: this.TEXT_MAX_LENGTH.toString(),
                id,
              },
            },
            {
              tag: 'div',
              className: 'card-form__counter',
              text: `0/${this.TEXT_MAX_LENGTH}`,
            },
          ],
        },
      ],
    };
  }

  /**
   * Создает конфигурацию для блока кнопок формы.
   *
   * @returns {ElementConfig} Конфигурация блока кнопок.
   * @private
   */
  private _createActions(): ElementConfig {
    return {
      tag: 'div',
      className: 'card-form__actions',
      children: [
        {
          tag: 'button',
          className: 'card-form__submit-btn',
          text: 'Добавить карточку',
          attrs: {
            type: 'submit',
          },
        },
        {
          tag: 'button',
          className: 'card-form__cancel-btn',
          text: 'Отмена',
          attrs: {
            type: 'button',
          },
        },
      ],
    };
  }

  /**
   * Навешивает обработчики событий на элементы формы.
   * @private
   */
  private _bindEvents(): void {
    this._titleInput = this._element.querySelector(
      '.card-form__input--title'
    ) as HTMLInputElement;
    this._textInput = this._element.querySelector(
      '.card-form__input--text'
    ) as HTMLTextAreaElement;
    this._submitBtn = this._element.querySelector(
      '.card-form__submit-btn'
    ) as HTMLButtonElement;
    this._titleCounter = this._element.querySelectorAll(
      '.card-form__counter'
    )[0] as HTMLElement;
    this._textCounter = this._element.querySelectorAll(
      '.card-form__counter'
    )[1] as HTMLElement;

    // События ввода для счетчиков
    this._titleInput.addEventListener('input', () => this._onTitleInput());
    this._textInput.addEventListener('input', () => this._onTextInput());

    // События кнопок
    this._submitBtn.addEventListener('click', () => this._onSubmit());

    const cancelBtn = this._element.querySelector(
      '.card-form__cancel-btn'
    ) as HTMLButtonElement;
    cancelBtn.addEventListener('click', () => this.options.onCancel());

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.options.onCancel();
    });
  }

  /**
   * Обработчик ввода в поле заголовка.
   * Обновляет счетчик символов и состояние кнопки отправки.
   *
   * @private
   */
  private _onTitleInput(): void {
    const length = this._titleInput.value.length;
    this._titleCounter.textContent = `${length}/${this.TITLE_MAX_LENGTH}`;
    this._updateSubmitButtonState();
  }

  /**
   * Обработчик ввода в поле текста.
   * Обновляет счетчик символов и состояние кнопки отправки.
   *
   * @private
   */
  private _onTextInput(): void {
    const length = this._textInput.value.length;
    this._textCounter.textContent = `${length}/${this.TEXT_MAX_LENGTH}`;
    this._updateSubmitButtonState();
  }

  /**
   * Обновляет состояние кнопки отправки формы.
   * Кнопка активна, если заполнено хотя бы одно из полей.
   *
   * @private
   */
  private _updateSubmitButtonState(): void {
    const hasTitle = this._titleInput.value.trim().length > 0;
    const hasText = this._textInput.value.trim().length > 0;
    this._submitBtn.disabled = !(hasTitle || hasText);
  }

  /**
   * Обработчик отправки формы.
   * Вызывает колбэк onSubmit с данными формы и очищает поля.
   *
   * @private
   */
  private _onSubmit(): void {
    const title = this._titleInput.value.trim();
    const text = this._textInput.value.trim();

    if (title || text) {
      this.options.onSubmit(title, text);
      this._clearForm();
    }
  }

  /**
   * Очищает поля формы и сбрасывает счетчики.
   * @private
   */
  private _clearForm(): void {
    this._titleInput.value = '';
    this._textInput.value = '';
    this._titleCounter.textContent = `0/${this.TITLE_MAX_LENGTH}`;
    this._textCounter.textContent = `0/${this.TEXT_MAX_LENGTH}`;

    this._updateSubmitButtonState();
  }
}
