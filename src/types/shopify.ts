import { createContext } from 'react';
import { ClientApplication } from '@shopify/app-bridge';
import { AuthenticatedFetch } from '@shopify/app-bridge-utils';

export interface ShopifyContextType {
  app: ClientApplication | null;
  shop: string | null;
  host: string | null;
  apiKey: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  authenticatedFetch: AuthenticatedFetch | null;
}

export const ShopifyContext = createContext<ShopifyContextType | undefined>(
  undefined
);