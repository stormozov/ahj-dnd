export interface ICreateElementOptions {
  tag?: string;
  className?: string | string[];
  id?: string;
  text?: string;
  html?: string;
  attrs?: Record<string, string>;
  children?: (HTMLElement | string | ElementConfig)[];
  parent?: HTMLElement;
}

export type ElementConfig = ICreateElementOptions;

export interface ICardData {
  id: string;
  title: string;
  text: string;
  columnId: string;
}

export interface IColumnData {
  id: string;
  title: string;
  cards: ICardData[];
}

export interface ICardFormOptions {
  columnId: string;

  onSubmit: (title: string, text: string) => void;
  onCancel: () => void;
}

export interface IColumnConfig {
  id: string;
  title: string;
}
