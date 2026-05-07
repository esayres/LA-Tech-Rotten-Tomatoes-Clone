import axios from 'axios';

const BASE_URL = 'https://api-zax4miz7qq-uc.a.run.app';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

// We will use a dynamic reference to the store to avoid circular imports
let storeReference = null;

export const injectStore = (store) => {
  storeReference = store;
};

// Request interceptor
apiClient.interceptors.request.use(async (config) => {
  if (storeReference) {
    const { ensureValidToken } = storeReference.getState();
    const validToken = await ensureValidToken();
    if (validToken) {
      config.headers.Authorization = `Bearer ${validToken}`;
      // Log truncated token for traceability without exposing the full secret
      console.log(`API [${config.method?.toUpperCase()}] ${config.url} - Auth: Bearer ...${validToken.slice(-6)}`);
    } else {
      console.log(`API [${config.method?.toUpperCase()}] ${config.url} - Guest Mode`);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API [${response.config.method?.toUpperCase()}] ${response.config.url} - Status: ${response.status} ✅`);
    if (response.config.method?.toUpperCase() === 'POST' || response.config.url?.includes('getUserLikes')) {
      console.log(`API Response Data:`, JSON.stringify(response.data));
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    
    if (status === 401 || error.response?.data?.unauthorized) {
      if (storeReference) {
        storeReference.getState().logout();
      }
    }

    if (status >= 500) {
      console.error('SERVER CRASH (500): Let Elijah know!', {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        response: error.response?.data
      });
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
