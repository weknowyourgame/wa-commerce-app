const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function main() {
  // Create sample merchants
  const merchant1 = await prisma.merchant.create({
    data: {
      upiNumber: 'merchant1@upi',
      apiToken: 'token1',
      website: 'https://merchant1.com',
      businessInfo: {
        name: 'Tech Gadgets Store',
        description: 'Premium tech gadgets and accessories',
        address: '123 Tech Street, Bangalore',
        phone: '+91-9876543210'
      }
    }
  });

  const merchant2 = await prisma.merchant.create({
    data: {
      upiNumber: 'merchant2@upi',
      apiToken: 'token2',
      website: 'https://merchant2.com',
      businessInfo: {
        name: 'Fashion Boutique',
        description: 'Trendy fashion and lifestyle products',
        address: '456 Fashion Avenue, Mumbai',
        phone: '+91-9876543211'
      }
    }
  });

  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        price: 2999.99,
        merchantId: merchant1.id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Smartphone Case',
        description: 'Durable protective case for smartphones',
        imageUrl: 'https://images.unsplash.com/photo-1603313011108-8d0c4b5c5b5b?w=500',
        price: 499.99,
        merchantId: merchant1.id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Designer T-Shirt',
        description: 'Comfortable and stylish cotton t-shirt',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        price: 899.99,
        merchantId: merchant2.id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Leather Wallet',
        description: 'Premium leather wallet with multiple card slots',
        imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
        price: 1299.99,
        merchantId: merchant2.id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Laptop Stand',
        description: 'Adjustable laptop stand for better ergonomics',
        imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500',
        price: 799.99,
        merchantId: merchant1.id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Running Shoes',
        description: 'Comfortable running shoes for daily workouts',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        price: 2499.99,
        merchantId: merchant2.id
      }
    })
  ]);

  console.log('Database seeded successfully!');
  console.log('Created merchants:', { merchant1: merchant1.id, merchant2: merchant2.id });
  console.log('Created products:', products.map(p => ({ id: p.id, name: p.name })));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 