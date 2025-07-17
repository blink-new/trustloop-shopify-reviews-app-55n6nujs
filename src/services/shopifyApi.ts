// Mock Shopify API service for demonstration purposes
// In a real app, this would be replaced with actual Shopify API calls

export interface ShopInfo {
  id: number;
  name: string;
  domain: string;
  email: string;
  plan_name: string;
  created_at: string;
  currency: string;
  timezone: string;
  country_name: string;
}

export interface Product {
  id: number;
  title: string;
  handle: string;
  status: string;
  created_at: string;
  updated_at: string;
  product_type: string;
  vendor: string;
  images: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
}

export interface Order {
  id: number;
  order_number: string;
  email: string;
  created_at: string;
  updated_at: string;
  total_price: string;
  currency: string;
  financial_status: string;
  fulfillment_status: string | null;
  line_items: Array<{
    id: number;
    product_id: number;
    title: string;
    quantity: number;
    price: string;
  }>;
}

class ShopifyAPIService {
  private baseUrl: string;
  private accessToken: string;
  private shopDomain: string;

  constructor(shopDomain: string, accessToken: string) {
    this.shopDomain = shopDomain;
    this.accessToken = accessToken;
    this.baseUrl = `https://${shopDomain}/admin/api/2023-10`;
  }

  private async makeRequest(endpoint: string): Promise<any> {
    // In demo mode, return mock data instead of making real API calls
    if (this.accessToken === 'demo_token' || this.shopDomain.includes('demo')) {
      return this.getMockData(endpoint);
    }

    // Real API call would be:
    // const response = await fetch(`${this.baseUrl}${endpoint}`, {
    //   headers: {
    //     'X-Shopify-Access-Token': this.accessToken,
    //     'Content-Type': 'application/json',
    //   },
    // });
    // 
    // if (!response.ok) {
    //   throw new Error(`API request failed: ${response.statusText}`);
    // }
    // 
    // return response.json();

    // For demo purposes, simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.getMockData(endpoint);
  }

  private getMockData(endpoint: string): any {
    switch (endpoint) {
      case '/shop.json':
        return {
          shop: {
            id: 12345,
            name: 'Demo Store',
            domain: this.shopDomain,
            email: 'admin@demo-store.com',
            plan_name: 'Shopify Plus',
            created_at: '2023-01-01T00:00:00Z',
            currency: 'USD',
            timezone: 'America/New_York',
            country_name: 'United States'
          }
        };

      case '/products.json':
        return {
          products: [
            {
              id: 1,
              title: 'Wireless Headphones',
              handle: 'wireless-headphones',
              status: 'active',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-15T00:00:00Z',
              product_type: 'Electronics',
              vendor: 'TechBrand',
              images: [
                {
                  id: 1,
                  src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
                  alt: 'Wireless Headphones'
                }
              ]
            },
            {
              id: 2,
              title: 'Smart Watch',
              handle: 'smart-watch',
              status: 'active',
              created_at: '2024-01-02T00:00:00Z',
              updated_at: '2024-01-16T00:00:00Z',
              product_type: 'Electronics',
              vendor: 'TechBrand',
              images: [
                {
                  id: 2,
                  src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
                  alt: 'Smart Watch'
                }
              ]
            }
          ]
        };

      case '/orders.json':
        return {
          orders: [
            {
              id: 1001,
              order_number: '1001',
              email: 'customer@example.com',
              created_at: '2024-07-10T00:00:00Z',
              updated_at: '2024-07-10T00:00:00Z',
              total_price: '199.99',
              currency: 'USD',
              financial_status: 'paid',
              fulfillment_status: 'fulfilled',
              line_items: [
                {
                  id: 1,
                  product_id: 1,
                  title: 'Wireless Headphones',
                  quantity: 1,
                  price: '199.99'
                }
              ]
            },
            {
              id: 1002,
              order_number: '1002',
              email: 'customer2@example.com',
              created_at: '2024-07-15T00:00:00Z',
              updated_at: '2024-07-15T00:00:00Z',
              total_price: '299.99',
              currency: 'USD',
              financial_status: 'paid',
              fulfillment_status: 'fulfilled',
              line_items: [
                {
                  id: 2,
                  product_id: 2,
                  title: 'Smart Watch',
                  quantity: 1,
                  price: '299.99'
                }
              ]
            }
          ]
        };

      default:
        throw new Error(`Mock data not available for endpoint: ${endpoint}`);
    }
  }

  async getShop(): Promise<ShopInfo> {
    const response = await this.makeRequest('/shop.json');
    return response.shop;
  }

  async getProducts(limit: number = 50): Promise<Product[]> {
    const response = await this.makeRequest('/products.json');
    return response.products.slice(0, limit);
  }

  async getOrders(limit: number = 50): Promise<Order[]> {
    const response = await this.makeRequest('/orders.json');
    return response.orders.slice(0, limit);
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.getShop();
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

export default ShopifyAPIService;