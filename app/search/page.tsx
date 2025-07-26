import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import { getProducts } from 'lib/products';

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ query: searchValue });
  
  // Apply sorting on the client side since we're using Prisma
  let sortedProducts = [...products];
  
  if (sortKey === 'PRICE') {
    sortedProducts.sort((a, b) => {
      const diff = a.price - b.price;
      return reverse ? -diff : diff;
    });
  } else if (sortKey === 'NAME') {
    sortedProducts.sort((a, b) => {
      const diff = a.name.localeCompare(b.name);
      return reverse ? -diff : diff;
    });
  } else if (sortKey === 'CREATED_AT') {
    sortedProducts.sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return reverse ? -diff : diff;
    });
  }
  // For RELEVANCE, we keep the order as returned by the database

  const resultsText = sortedProducts.length > 1 ? 'results' : 'result';

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {sortedProducts.length === 0
            ? 'There are no products that match '
            : `Showing ${sortedProducts.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {sortedProducts.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={sortedProducts} />
        </Grid>
      ) : null}
    </>
  );
}
