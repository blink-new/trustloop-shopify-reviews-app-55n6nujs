import React, { useState } from 'react';
import { OnboardingWizard } from '../components/onboarding/OnboardingWizard';
import { StoreConnection } from '../components/store/StoreConnection';
import ShopifyAPIService from '../services/shopifyApi';

interface StoreData {
  name: string;
  domain: string;
  plan: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  permissions: {
    name: string;
    granted: boolean;
    required: boolean;
  }[];
}

export default function StoreSetup() {
  const [isConnected, setIsConnected] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(!isConnected);
  const [storeData, setStoreData] = useState<StoreData | null>(null);

  const handleOnboardingComplete = async (data: { shopDomain: string; accessToken: string }) => {
    try {
      // Get real store data from Shopify API
      const apiService = new ShopifyAPIService(data.shopDomain, data.accessToken);
      const shopInfo = await apiService.getShop();
      
      const storeData: StoreData = {
        name: shopInfo.name,
        domain: data.shopDomain,
        plan: shopInfo.plan_name,
        status: 'connected',
        lastSync: new Date().toLocaleString(),
        permissions: [
          { name: 'read_products', granted: true, required: true },
          { name: 'read_orders', granted: true, required: true },
          { name: 'read_customers', granted: true, required: true },
          { name: 'read_themes', granted: true, required: true },
          { name: 'write_script_tags', granted: true, required: true },
          { name: 'read_inventory', granted: false, required: false },
        ]
      };

      setStoreData(storeData);
      setIsConnected(true);
      setShowOnboarding(false);
      
      // Store connection data in localStorage
      localStorage.setItem('trustloop_store_data', JSON.stringify(storeData));
      localStorage.setItem('trustloop_api_credentials', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to get store data:', error);
      // Fallback to basic data if API call fails
      const basicStoreData: StoreData = {
        name: 'Your Store',
        domain: data.shopDomain,
        plan: 'Unknown',
        status: 'connected',
        lastSync: new Date().toLocaleString(),
        permissions: [
          { name: 'read_products', granted: true, required: true },
          { name: 'read_orders', granted: true, required: true },
          { name: 'read_customers', granted: true, required: true },
          { name: 'read_themes', granted: true, required: true },
          { name: 'write_script_tags', granted: true, required: true },
          { name: 'read_inventory', granted: false, required: false },
        ]
      };
      
      setStoreData(basicStoreData);
      setIsConnected(true);
      setShowOnboarding(false);
      localStorage.setItem('trustloop_store_data', JSON.stringify(basicStoreData));
    }
  };

  const handleReconnect = () => {
    setShowOnboarding(true);
  };

  const handleManageConnection = () => {
    setShowOnboarding(true);
  };

  // Check for existing connection on component mount
  React.useEffect(() => {
    const savedData = localStorage.getItem('trustloop_store_data');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setStoreData(data);
        setIsConnected(true);
        setShowOnboarding(false);
      } catch (error) {
        console.error('Failed to parse saved store data:', error);
      }
    }
  }, []);

  if (showOnboarding) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Store Setup</h2>
          <p className="text-muted-foreground">
            Manage your Shopify store connection and permissions
          </p>
        </div>
      </div>

      <StoreConnection 
        store={storeData} 
        onReconnect={handleReconnect}
        onManageConnection={handleManageConnection}
      />
    </div>
  );
}