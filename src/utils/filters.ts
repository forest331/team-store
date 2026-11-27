import { Book } from '../data/books';

export type SortDirection = 'default' | 'asc' | 'desc';

export interface FilterState {
  search: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  sort: SortDirection;
}

export function filterByCategory(books: Book[], category: string): Book[] {
  if (!category || category === 'all') return [...books];
  return books.filter((book) => book.category === category);
}

export function searchBooks(books: Book[], query: string): Book[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [...books];
  return books.filter((book) => book.title.toLowerCase().includes(normalizedQuery));
}

export function filterByPriceRange(
  books: Book[],
  minPrice: number | null,
  maxPrice: number | null,
): Book[] {
  return books.filter((book) => {
    if (minPrice !== null && book.price < minPrice) return false;
    if (maxPrice !== null && book.price > maxPrice) return false;
    return true;
  });
}

export function sortBooksByPrice(books: Book[], direction: SortDirection = 'default'): Book[] {
  if (direction === 'default') return [...books];
  const multiplier = direction === 'desc' ? -1 : 1;
  return [...books].sort((first, second) => (first.price - second.price) * multiplier);
}

export function applyBookFilters(books: Book[], state: FilterState): Book[] {
  const byCategory = filterByCategory(books, state.category);
  const bySearch = searchBooks(byCategory, state.search);
  const byPrice = filterByPriceRange(bySearch, state.minPrice, state.maxPrice);
  return sortBooksByPrice(byPrice, state.sort);
}
