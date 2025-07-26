import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import type { ProductWithMerchant } from 'lib/types';
import Link from 'next/link';

export default function ProductGridItems({ products }: { products: ProductWithMerchant[] }) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.id} className="animate-fadeIn">
          <Link
            className="relative inline-block h-full w-full"
            href={`/product/${product.id}`}
            prefetch={true}
          >
            <GridTileImage
              alt={product.name}
              label={{
                title: product.name,
                amount: product.price.toString(),
                currencyCode: 'INR'
              }}
              src={product.imageUrl || 'https://via.placeholder.com/500x500?text=Product+Image'}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
        </Grid.Item>
      ))}
    </>
  );
}
