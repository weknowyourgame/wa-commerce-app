// Configuration for merchant selection
export const config = {
  // Set this to the API token of the merchant you want to load
  // Available tokens from seed data:
  // - "token1" (Tech Gadgets Store)
  // - "token2" (Fashion Boutique)
  MERCHANT_API_TOKEN: process.env.MERCHANT_API_TOKEN || 'token1',
  
  // Site configuration
  SITE_NAME: process.env.SITE_NAME || 'Commerce Store',
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL
};

// Get the current merchant
export async function getCurrentMerchant() {
  const { getMerchantByApiToken } = await import('./merchants');
  return await getMerchantByApiToken(config.MERCHANT_API_TOKEN);
} 