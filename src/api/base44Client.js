import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68d3c16763e1ce866b62b231",
  requiresAuth: false // Temporarily disable auth requirement for testing
});
