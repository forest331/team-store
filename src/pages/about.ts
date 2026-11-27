import { createElement } from '../utils/dom';

interface TeamMember {
  role: string;
  name: string;
  contributions: string[];
}

export function renderAboutPage() {
  const section = document.getElementById('section-about');
  if (!section) return;

  section.replaceChildren();

  const title = createElement('h1', '', 'О проекте');

  const description = createElement(
    'p',
    'about__description',
    'Интернет-магазин книг — учебное одностраничное приложение (SPA) на TypeScript. Здесь можно изучить каталог книг, отфильтровать, добавить понравившиеся в корзину и оформить заказ со скидкой по промокоду.',
  );

  const teamMembers: TeamMember[] = [
    {
      role: 'Ведущий',
      name: 'forest331',
      contributions: [
        'создание репозитория и приглашение напарника',
        'настройка Vite + TypeScript + Vitest + ESLint + Prettier + husky',
        'доска задач GitHub Projects',
        'корзина, промокод, расчёт суммы',
        'unit-тесты расчёта корзины',
        'CI и деплой',
      ],
    },
    {
      role: 'Напарник',
      name: 'IvanK9',
      contributions: [
        'страница «О нас» с описанием проекта и вклада участников',
        'данные товаров',
        'каталог и карточки товаров',
        'поиск, фильтр по категории, сортировка по цене (stretch)',
        'unit-тесты фильтрации',
      ],
    },
  ];

  const teamHeading = createElement('h2', 'about__subtitle', 'Команда и вклад в разработку');
  const teamWrapper = createElement('div', 'about__wrapper');

  teamMembers.forEach((member) => {
    const card = createElement('article', 'about__card');
    const memberTitle = createElement('h3', 'about__card-title', `${member.role} (${member.name})`);
    const list = createElement('ul', 'about__card-list');

    member.contributions.forEach((item) => {
      const listItem = createElement('li', 'about__card-item', item);
      list.append(listItem);
    });
    card.append(memberTitle, list);
    teamWrapper.append(card);
  });

  section.append(title, description, teamHeading, teamWrapper);
}
