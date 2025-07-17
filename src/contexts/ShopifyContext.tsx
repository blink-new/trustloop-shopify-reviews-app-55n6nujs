import React, { useEffect, useState, ReactNode, useMemo } from 'react';
import createApp, { ClientApplication } from '@shopify/app-bridge';
import { authenticatedFetch, getSessionToken } from '@shopify/app-bridge-utils';
import { ShopifyContext, ShopifyContextType } from '../types/shopify';

interface ShopifyProviderProps {
  children: ReactNode;
  apiKey: string;
}

export function ShopifyProvider({ children, apiKey }: ShopifyProviderProps) {
  const [app, setApp] = useState<ClientApplication | null>(null);
  const [shop, setShop] = useState<string | null>(null);
  const [host, setHost] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authFetch = useMemo(() => {
    if (app) {
      return authenticatedFetch(app);
    }
    return null;
  }, [app]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shopParam = urlParams.get('shop');
    const hostParam = urlParams.get('host');

    if (shopParam && hostParam && apiKey) {
      try {
        const appInstance = createApp({
          apiKey,
          host: hostParam,
          forceRedirect: true,
        });

        setApp(appInstance);
        setShop(shopParam);
        setHost(hostParam);

        // Get session token to verify authentication
        getSessionToken(appInstance)
          .then((token) => {
            if (token) {
              setIsAuthenticated(true);
            }
            setIsLoading(false);
          })
          .catch((err) => {
            console.error('Failed to get session token:', err);
            setError('Failed to authenticate with Shopify');
            setIsLoading(false);
          });

      } catch (err) {
        console.error('Failed to create Shopify app:', err);
        setError('Failed to initialize Shopify app');
        setIsLoading(false);
      }
    } else {
      // Check for credentials in localStorage
      const savedCreds = localStorage.getItem('trustloop_api_credentials');
      if (savedCreds) {
        try {
          const { shopDomain, accessToken } = JSON.parse(savedCreds);
          // In a real app, you would use these to initialize the app bridge
          // For this demo, we'll just mark as authenticated
          setIsAuthenticated(true);
        } catch (e) {
          console.error('Failed to parse saved credentials', e);
        }
      }
      setIsLoading(false);
    }
  }, [apiKey]);

  const value: ShopifyContextType = {
    app,
    shop,
    host,
    isAuthenticated,
    isLoading,
    error,
    apiKey,
    authenticatedFetch: authFetch,
  };

  return (
    <ShopifyContext.Provider value={value}>
      {children}
    </ShopifyContext.Provider>
  );
}
