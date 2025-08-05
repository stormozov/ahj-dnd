import { ElementConfig, ICreateElementOptions } from '../shared/interface';

export default function createElement({
  tag = 'div',
  className,
  id,
  text,
  html,
  attrs = {},
  children = [],
  parent,
}: ICreateElementOptions = {}): HTMLElement {
  const element = document.createElement(tag);

  if (className) {
    if (typeof className === 'string') {
      element.className = className;
    } else if (Array.isArray(className)) {
      element.classList.add(...className);
    }
  }

  if (id) element.id = id;
  if (text !== undefined) element.textContent = text;
  if (html !== undefined) element.innerHTML = html;

  Object.entries(attrs).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  children.forEach((child) => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof HTMLElement) {
      element.appendChild(child);
    } else {
      // Если child это ElementConfig, создаем элемент рекурсивно
      element.appendChild(createElement(child));
    }
  });

  if (parent) parent.appendChild(element);

  return element;
}

export function createElements(configs: ElementConfig[]): HTMLElement[] {
  return configs.map((config) => createElement(config));
}
