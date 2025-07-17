import { createClient } from '@blinkdotnew/sdk';

export const blink = createClient({
  projectId: 'trustloop-shopify-reviews-app-55n6nujs',
  authRequired: false, // We will handle the auth state manually
});
