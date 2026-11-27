import { books, Book } from '../data/books';
import { createElement } from '../utils/dom';

export function createBookCard(book: Book): HTMLElement {
  const card = createElement('li', 'catalog__card card');
  card.dataset.id = String(book.id);

  const image = document.createElement('img');
  image.className = 'card__image';
  image.src = book.image;
  image.alt = book.title;
  image.loading = 'lazy';

  const content = createElement('div', 'card__content');
  const category = createElement('span', 'card__category', book.category);
  const title = createElement('h3', 'card__title', book.title);
  const author = createElement('p', 'card__author', book.author);

  const footer = createElement('div', 'card__footer');
  const price = createElement('span', 'card__price', `${book.price} ₽`);

  const addButton = createElement('button', 'card__button', 'В корзину');
  addButton.dataset.id = String(book.id);

  addButton.addEventListener('click', (event) => {
    event.stopPropagation();
    // Позже добавим логику добавления в корзину
  });

  card.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.closest('.book-card__button')) return;
    openBookModal(book);
  });

  footer.append(price, addButton);
  content.append(category, title, author, footer);
  card.append(image, content);

  return card;
}

export function renderCatalog(): void {
  const section = document.getElementById('section-catalog');
  if (!section) return;

  section.replaceChildren();

  const title = createElement('h2', 'catalog__title', 'Каталог книг');

  const catalogWrapper = createElement('div', 'catalog__wrapper');
  const catalog = createElement('ul', 'catalog__list');

  books.forEach((book) => {
    const card = createBookCard(book);
    catalog.append(card);
  });

  catalogWrapper.append(title, catalog);
  section.append(catalogWrapper);
}

export function openBookModal(book: Book): void {
  document.querySelector<HTMLDialogElement>('.modal')?.remove();

  const dialog = createElement('dialog', 'modal');

  const closeBtn = createElement('button', 'modal__btn--close', '×');
  closeBtn.setAttribute('aria-label', 'Закрыть');

  const body = createElement('div', 'modal__wrapper');

  const image = document.createElement('img');
  image.className = 'modal__image';
  image.src = book.image;
  image.alt = book.title;

  const info = createElement('div', 'modal__info');
  const category = createElement('span', 'modal__category', book.category);
  const title = createElement('h2', 'modal__title', book.title);
  const author = createElement('p', 'modal__author', book.author);
  const description = createElement('p', 'modal__description', book.description);

  const footer = createElement('div', 'modal__footer');
  const price = createElement('span', 'modal__price', `${book.price} ₽`);
  const addButton = createElement('button', 'card__button', 'В корзину');
  addButton.dataset.id = String(book.id);

  footer.append(price, addButton);
  info.append(category, title, author, description, footer);
  body.append(image, info);
  dialog.append(closeBtn, body);

  closeBtn.addEventListener('click', () => dialog.close());

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.addEventListener('close', () => dialog.remove());

  document.body.append(dialog);
  dialog.showModal();
}
