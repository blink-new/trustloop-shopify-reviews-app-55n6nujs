import { useContext } from 'react';
import { ShopifyContext } from '../types/shopify';

export const useShopify = () => {
  const context = useContext(ShopifyContext);
  if (context === undefined) {
    throw new Error('useShopify must be used within a ShopifyProvider');
  }
  return context;
};