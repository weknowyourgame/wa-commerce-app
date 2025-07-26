import { Carousel } from 'components/carousel';
import { ThreeItemGrid } from 'components/grid/three-items';
import Footer from 'components/layout/footer';
import { MerchantInfo } from 'components/merchant-info';
import { getCurrentMerchant } from 'lib/config';

export const metadata = {
  description:
    'High-performance ecommerce store built with Next.js, Vercel, and PostgreSQL.',
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage() {
  const merchant = await getCurrentMerchant();

  return (
    <>
      <MerchantInfo merchant={merchant} />
      <ThreeItemGrid />
      <Carousel />
      <Footer />
    </>
  );
}
