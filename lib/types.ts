import { Customer, Merchant, Order, OrderStatus, Product } from '@prisma/client';

export type ProductWithMerchant = Product & {
  merchant: Merchant;
};

export type OrderWithRelations = Order & {
  customer: Customer;
  merchant: Merchant;
  product: Product;
};

export type MerchantWithProducts = Merchant & {
  products: Product[];
};

export type CustomerWithOrders = Customer & {
  orders: OrderWithRelations[];
};

export { OrderStatus };
