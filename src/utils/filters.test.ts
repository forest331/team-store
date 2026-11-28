import { describe, it, expect } from 'vitest';
import { Book, BookCategory } from '../data/books';
import {
  filterByCategory,
  searchBooks,
  filterByPriceRange,
  sortBooksByPrice,
  applyBookFilters,
  FilterState,
} from './filters';

const mockBooks: Book[] = [
  {
    id: 1,
    title: 'Властелин колец',
    author: 'Дж. Р. Р. Толкин',
    category: BookCategory.Fantasy,
    price: 1150,
    image: '/images/book-1.jpg',
    description: 'Описание 1',
  },
  {
    id: 2,
    title: 'Мастер и Маргарита',
    author: 'Михаил Булгаков',
    category: BookCategory.RussianClassic,
    price: 650,
    image: '/images/book-2.jpg',
    description: 'Описание 2',
  },
  {
    id: 3,
    title: 'Ведьмак',
    author: 'Анджей Сапковский',
    category: BookCategory.Fantasy,
    price: 890,
    image: '/images/book-3.jpg',
    description: 'Описание 3',
  },
  {
    id: 4,
    title: 'Преступление и наказание',
    author: 'Фёдор Достоевский',
    category: BookCategory.RussianClassic,
    price: 590,
    image: '/images/book-4.jpg',
    description: 'Описание 4',
  },
];

describe('Фильтрация и сортировка книг', () => {
  describe('filterByCategory', () => {
    it('возвращает все книги при выборе "all" или пустой строки', () => {
      expect(filterByCategory(mockBooks, 'all')).toHaveLength(4);
      expect(filterByCategory(mockBooks, '')).toHaveLength(4);
    });

    it('фильтрует книги по выбранной категории', () => {
      const fantasyBooks = filterByCategory(mockBooks, BookCategory.Fantasy);
      expect(fantasyBooks).toHaveLength(2);
      expect(fantasyBooks.every((b) => b.category === BookCategory.Fantasy)).toBe(true);
    });
  });

  describe('searchBooks', () => {
    it('возвращает все книги при пустой строке или пробелах', () => {
      expect(searchBooks(mockBooks, '')).toHaveLength(4);
      expect(searchBooks(mockBooks, '   ')).toHaveLength(4);
    });

    it('ищет по части названия без учёта регистра', () => {
      const result = searchBooks(mockBooks, 'мастер');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Мастер и Маргарита');

      const upperResult = searchBooks(mockBooks, 'КОЛЕЦ');
      expect(upperResult).toHaveLength(1);
      expect(upperResult[0].id).toBe(1);
    });

    it('возвращает пустой массив, если совпадений нет', () => {
      expect(searchBooks(mockBooks, 'Несуществующая книга')).toEqual([]);
    });
  });

  describe('filterByPriceRange', () => {
    it('возвращает все книги, если обе границы null', () => {
      expect(filterByPriceRange(mockBooks, null, null)).toHaveLength(4);
    });

    it('фильтрует только по нижней границе "От" включительно', () => {
      const result = filterByPriceRange(mockBooks, 890, null);
      expect(result.map((b) => b.price)).toEqual([1150, 890]);
    });

    it('фильтрует только по верхней границе "До" включительно', () => {
      const result = filterByPriceRange(mockBooks, null, 650);
      expect(result.map((b) => b.price)).toEqual([650, 590]);
    });

    it('фильтрует по диапазону "От" и "До" одновременно включительно', () => {
      const result = filterByPriceRange(mockBooks, 650, 890);
      expect(result.map((b) => b.price)).toEqual([650, 890]);
    });
  });

  describe('sortBooksByPrice', () => {
    it('сохраняет исходный порядок при direction = "default"', () => {
      const result = sortBooksByPrice(mockBooks, 'default');
      expect(result.map((b) => b.id)).toEqual([1, 2, 3, 4]);
    });

    it('сортирует по возрастанию цены (asc)', () => {
      const result = sortBooksByPrice(mockBooks, 'asc');
      expect(result.map((b) => b.price)).toEqual([590, 650, 890, 1150]);
    });

    it('сортирует по убыванию цены (desc)', () => {
      const result = sortBooksByPrice(mockBooks, 'desc');
      expect(result.map((b) => b.price)).toEqual([1150, 890, 650, 590]);
    });

    it('не мутирует исходный массив при сортировке', () => {
      const originalIds = mockBooks.map((b) => b.id);
      sortBooksByPrice(mockBooks, 'asc');
      expect(mockBooks.map((b) => b.id)).toEqual(originalIds);
    });
  });

  describe('applyBookFilters (комплексная проверка)', () => {
    it('одновременно применяет категорию, поиск, диапазон цен и сортировку', () => {
      const state: FilterState = {
        search: 'в', // Подходят «Властелин колец» и «Ведьмак»
        category: BookCategory.Fantasy,
        minPrice: 800,
        maxPrice: 1200,
        sort: 'asc',
      };

      const result = applyBookFilters(mockBooks, state);
      expect(result).toHaveLength(2);
      // Сначала должна идти более дешевая книга («Ведьмак» за 890)
      expect(result.map((b) => b.title)).toEqual(['Ведьмак', 'Властелин колец']);
    });

    it('возвращает пустой массив, если комбинация фильтров ничего не нашла', () => {
      const state: FilterState = {
        search: 'Мастер',
        category: BookCategory.Fantasy, // Булгаков в классике, а не в фэнтези
        minPrice: null,
        maxPrice: null,
        sort: 'default',
      };

      expect(applyBookFilters(mockBooks, state)).toEqual([]);
    });
  });
});
