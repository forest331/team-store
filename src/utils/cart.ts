// Временные типы, в дальнейшем напарник их сделает в src/types.ts
export type Product = {
  id: number;
  title: string;
  category: 'Российская классика' | 'Фэнтези';
  price: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CartTotals = {
  subtotal: number;
  discount: number;
  total: number;
};

export function calculateCart(items: CartItem[], promoCode: string = ''): CartTotals {
  const subtotal = items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  let discount = 0;
  if (promoCode.trim().toUpperCase() === 'SALE10') {
    discount = subtotal * 0.1;
  }

  const total = subtotal - discount;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
}
