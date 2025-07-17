import { useContext } from 'react';
import { ShopifyContext, ShopifyContextType } from '../types/shopify';

export function useShopify(): ShopifyContextType {
  const context = useContext(ShopifyContext);

  if (context === undefined) {
    throw new Error('useShopify must be used within a ShopifyProvider');
  }

  return context;
}
