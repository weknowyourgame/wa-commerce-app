export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: 'RELEVANCE' | 'CREATED_AT' | 'PRICE' | 'NAME';
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: 'Relevance',
  slug: null,
  sortKey: 'RELEVANCE',
  reverse: false
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  { title: 'Latest arrivals', slug: 'latest-desc', sortKey: 'CREATED_AT', reverse: true },
  { title: 'Price: Low to high', slug: 'price-asc', sortKey: 'PRICE', reverse: false },
  { title: 'Price: High to low', slug: 'price-desc', sortKey: 'PRICE', reverse: true },
  { title: 'Name: A to Z', slug: 'name-asc', sortKey: 'NAME', reverse: false },
  { title: 'Name: Z to A', slug: 'name-desc', sortKey: 'NAME', reverse: true }
];

export const TAGS = {
  products: 'products',
  merchants: 'merchants',
  orders: 'orders'
};

export const DEFAULT_OPTION = 'Default Title';
