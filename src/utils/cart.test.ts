import { describe, it, expect } from 'vitest';
import { calculateCart, type CartItem } from './cart';

const createMockItem = (id: number, price: number, quantity: number): CartItem => ({
  product: {
    id,
    title: `Книга ${id}`,
    category: 'Фэнтези',
    price,
  },
  quantity,
});

describe('calculateCart', () => {
  it('должна возвращать нули для пустой корзины', () => {
    const result = calculateCart([], '');
    expect(result).toEqual({ subtotal: 0, discount: 0, total: 0 });
  });

  it('должна правильно считать сумму без промокода', () => {
    const items = [createMockItem(1, 500, 2), createMockItem(2, 300, 1)];
    const result = calculateCart(items, '');
    expect(result.subtotal).toBe(1300);
    expect(result.discount).toBe(0);
    expect(result.total).toBe(1300);
  });

  it('должна применять скидку 10% по промокоду SALE10', () => {
    const items = [createMockItem(1, 1000, 1)];
    const result = calculateCart(items, 'SALE10');
    expect(result.subtotal).toBe(1000);
    expect(result.discount).toBe(100);
    expect(result.total).toBe(900);
  });

  it('должна игнорировать неизвестный промокод', () => {
    const items = [createMockItem(1, 1000, 1)];
    const result = calculateCart(items, 'UNKNOWN_CODE');
    expect(result.subtotal).toBe(1000);
    expect(result.discount).toBe(0);
    expect(result.total).toBe(1000);
  });

  it('должна корректно обрабатывать несколько товаров и количество > 1', () => {
    const items = [createMockItem(1, 200, 3), createMockItem(2, 400, 1)];
    const result = calculateCart(items, 'SALE10');
    expect(result.subtotal).toBe(1000);
    expect(result.discount).toBe(100);
    expect(result.total).toBe(900);
  });
});
