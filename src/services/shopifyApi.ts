import { AuthenticatedFetch } from '@shopify/app-bridge-utils';

class ShopifyAPIService {
  private fetch: AuthenticatedFetch;

  constructor(fetch: AuthenticatedFetch) {
    this.fetch = fetch;
  }

  async getShop(): Promise<any> {
    const response = await this.fetch('/api/shop.json');
    return response.json();
  }

  async getReviews(productId?: string): Promise<any> {
    const url = productId ? `/api/products/${productId}/reviews.json` : '/api/reviews.json';
    const response = await this.fetch(url);
    return response.json();
  }

  async getProducts(): Promise<any> {
    const response = await this.fetch('/api/products.json');
    return response.json();
  }
}

export default ShopifyAPIService;
