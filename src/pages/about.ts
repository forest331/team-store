import { createElement } from '../utils/dom';

export function renderAboutPage() {
  const section = document.getElementById('section-about');
  if (!section) return;

  section.replaceChildren();

  const title = createElement('h1', '', 'О проекте');

  section.append(title);
}
