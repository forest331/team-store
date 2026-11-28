import { books, Book, BookCategory } from '../data/books';
import { createElement } from '../utils/dom';
import { applyBookFilters, FilterState, SortDirection } from '../utils/filters';

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

  const state: FilterState = {
    search: '',
    category: 'all',
    minPrice: null,
    maxPrice: null,
    sort: 'default',
  };

  const title = createElement('h2', 'catalog__title', 'Каталог книг');

  const catalogWrapper = createElement('div', 'catalog__wrapper');

  const controls = createElement('div', 'catalog__controls controls');

  const searchInput = createElement('input', 'controls__input controls__input--search');
  searchInput.type = 'text';
  searchInput.placeholder = 'Поиск по названию...';

  const categorySelect = createElement('select', 'controls__select');
  const allOption = createElement('option', '', 'Все категории');
  allOption.value = 'all';
  categorySelect.append(allOption);

  Object.values(BookCategory).forEach((category) => {
    const option = createElement('option', '', `${category}`);
    option.value = category;
    categorySelect.append(option);
  });

  const priceGroup = createElement('div', 'controls__price-group');
  const minPriceInput = createElement('input', 'controls__input controls__price');
  minPriceInput.type = 'number';
  minPriceInput.min = '0';
  minPriceInput.placeholder = 'Цена от';

  const maxPriceInput = createElement('input', 'controls__input controls__price');
  maxPriceInput.type = 'number';
  maxPriceInput.min = '0';
  maxPriceInput.placeholder = 'Цена до';

  priceGroup.append(minPriceInput, maxPriceInput);

  const sortSelect = createElement('select', 'controls__select');

  const sortOptions: { value: SortDirection; label: string }[] = [
    { value: 'default', label: 'По умолчанию' },
    { value: 'asc', label: 'Сначала дешевле' },
    { value: 'desc', label: 'Сначала дороже' },
  ];

  sortOptions.forEach(({ value, label }) => {
    const option = createElement('option', '', `${label}`);
    option.value = value;
    sortSelect.append(option);
  });

  const resetButton = createElement('button', 'controls__reset', 'Сбросить');
  resetButton.type = 'button';

  controls.append(searchInput, categorySelect, priceGroup, sortSelect, resetButton);

  const catalog = createElement('ul', 'catalog__list');

  const updateCatalogList = () => {
    catalog.replaceChildren();
    const filteredBooks = applyBookFilters(books, state);

    if (filteredBooks.length === 0) {
      const emptyMessage = createElement(
        'li',
        'catalog__empty',
        'По вашему запросу книги не найдены. Попробуйте изменить параметры фильтра или сбросить их.',
      );
      catalog.append(emptyMessage);
      return;
    }

    filteredBooks.forEach((book) => {
      const card = createBookCard(book);
      catalog.append(card);
    });
  };

  searchInput.addEventListener('input', () => {
    state.search = searchInput.value;
    updateCatalogList();
  });

  categorySelect.addEventListener('change', () => {
    state.category = categorySelect.value;
    updateCatalogList();
  });

  minPriceInput.addEventListener('input', () => {
    state.minPrice = minPriceInput.value === '' ? null : Number(minPriceInput.value);
    updateCatalogList();
  });

  maxPriceInput.addEventListener('input', () => {
    state.maxPrice = maxPriceInput.value === '' ? null : Number(maxPriceInput.value);
    updateCatalogList();
  });

  sortSelect.addEventListener('change', () => {
    state.sort = sortSelect.value as SortDirection;
    updateCatalogList();
  });

  resetButton.addEventListener('click', () => {
    state.search = '';
    state.category = 'all';
    state.minPrice = null;
    state.maxPrice = null;
    state.sort = 'default';

    searchInput.value = '';
    categorySelect.value = 'all';
    minPriceInput.value = '';
    maxPriceInput.value = '';
    sortSelect.value = 'default';

    updateCatalogList();
  });

  catalogWrapper.append(title, controls, catalog);
  section.append(catalogWrapper);

  updateCatalogList();
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
