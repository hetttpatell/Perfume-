import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper to check if a JWT token is expired or close to expiring (threshold in seconds)
export const isTokenExpired = (token, thresholdSeconds = 60) => {
  if (!token) return true;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return true;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const { exp } = JSON.parse(jsonPayload);
    if (!exp) return false;
    return Date.now() >= (exp - thresholdSeconds) * 1000;
  } catch {
    return true;
  }
};

let refreshPromise = null;

// Proactively ensure valid token before making API requests
export const ensureValidToken = async () => {
  const token = localStorage.getItem('lune_token');
  const refreshToken = localStorage.getItem('lune_refresh_token');

  // If token exists and is not expired, return it immediately
  if (token && !isTokenExpired(token)) {
    return token;
  }

  // If no refresh token is available, return null
  if (!refreshToken) {
    return null;
  }

  // Deduplicate concurrent token refresh attempts
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = refreshSessionToken().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};

// Request interceptor to proactively refresh tokens and attach Authorization header
apiClient.interceptors.request.use(
  async (config) => {
    if (
      config.url?.includes('/auth/refresh') ||
      config.url?.includes('/auth/login') ||
      config.url?.includes('/auth/register')
    ) {
      return config;
    }

    const validToken = await ensureValidToken();
    if (validToken) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${validToken}`);
      } else {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${validToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unexpected 401 Unauthorized errors & retry
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, newToken = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(newToken);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest?.url?.includes('/auth/refresh') ||
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register')
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            if (originalRequest.headers && typeof originalRequest.headers.set === 'function') {
              originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
            } else {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const newToken = await refreshSessionToken();
        isRefreshing = false;

        if (newToken) {
          processQueue(null, newToken);
          if (originalRequest.headers && typeof originalRequest.headers.set === 'function') {
            originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
          } else {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          }
          return apiClient(originalRequest);
        } else {
          processQueue(new Error('Token refresh failed'), null);
          return Promise.reject(error);
        }
      } catch (refreshErr) {
        isRefreshing = false;
        processQueue(refreshErr, null);
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

// Helper to normalize database fields to frontend component expectations
export const normalizeProduct = (p) => {
  if (!p) return null;
  const scent = p.scentDetails || p.scent_details || {};
  const sizes = p.sizes || [];
  const images = p.images || [];

  const resolveImgPath = (url) => {
    if (!url) return '/SVGs/Perfume-SVG.png';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
    if (url.startsWith('src/assets/')) return '/' + url.replace('src/assets/', 'assets/');
    if (url.startsWith('assets/')) return '/' + url;
    if (!url.startsWith('/')) return '/' + url;
    return url;
  };

  // Separate hero section image records from standard product catalog photos
  const heroRec = (images || []).find(img => img.alt_text === 'hero_image');
  const standardImages = (images || []).filter(img => img.alt_text !== 'hero_image');

  const rawMain = standardImages.find(img => img.is_primary)?.image_url || p.image_url || p.image;
  const mainImage = resolveImgPath(rawMain);

  // Merge standard images for product page gallery (excluding hero showcase image)
  const fromTable = standardImages.map(img => img.image_url).filter(Boolean);
  const fromColumn = Array.isArray(p.gallery_images) ? p.gallery_images : (Array.isArray(p.galleryImages) ? p.galleryImages : []);
  const merged = [...new Set([...fromTable, ...fromColumn])];
  const heroUrl = p.hero_image_url || p.heroImageUrl || heroRec?.image_url || '';
  const subImages = merged.filter(url => url !== rawMain && url !== heroUrl);
  const rawGallery = rawMain ? [rawMain, ...subImages] : (merged.length > 0 ? merged : [rawMain]);
  const gallery = rawGallery.map(resolveImgPath);

  return {
    id: p.id,
    name: p.name,
    frenchName: p.french_name || p.frenchName || '',
    category: p.category,
    subtitle: p.subtitle || '',
    price: Number(p.price),
    priceFormatted: `$ ${Number(p.price).toFixed(0)}`,
    inStock: p.in_stock !== false && p.inStock !== false,
    in_stock: p.in_stock !== false && p.inStock !== false,
    badge: p.badge || 'HAUTE COUTURE',
    rating: String(p.rating || '5.0'),
    reviewsCount: p.reviews_count || p.reviewsCount || 0,
    image: mainImage,
    galleryImages: gallery,
    imagesList: images,
    heroImageUrl: (() => {
      const heroRec = (images || []).find(img => img.alt_text === 'hero_image');
      const rawHero = p.hero_image_url || p.heroImageUrl || heroRec?.image_url || '';
      return rawHero ? resolveImgPath(rawHero) : '';
    })(),
    heroTitle: p.hero_title || p.name,
    heroSubtitle: p.hero_subtitle || p.french_name || p.subtitle,
    heroQuote: p.hero_quote || p.description,
    heroNote1: p.hero_note_1 || 'Galbanum',
    heroNote2: p.hero_note_2 || 'Iris Pallida',
    heroNote3: p.hero_note_3 || 'Vetiver',
    engravingAvailable: p.engraving_available !== false,
    giftBoxIncluded: p.gift_box_included !== false,
    isHero: p.is_hero || false,
    isFeatured: p.is_featured || false,
    description: p.description || '',
    scentDetails: scent,
    sizes: sizes.length > 0 ? sizes.map(s => ({
      size: s.size,
      price: Number(s.price),
      label: s.label || `${s.size} / ${(Number(s.size.replace(/\D/g, '')) * 0.0338).toFixed(1)} FL. OZ.`
    })) : [
      { size: '50 ml', price: Number(p.price), label: '50 ml / 1.7 FL. OZ.' }
    ],
    scentFamily: scent.scent_family || p.scentFamily || 'Haute Parfumerie Creation',
    greatFor: scent.great_for || p.greatFor || 'Connoisseurs, evening wear',
    theFeel: scent.the_feel || p.theFeel || 'Radiantly lingering aura',
    notes: {
      top: scent.top_notes || p.notes?.top || 'Iranian Galbanum, Neroli de Grasse',
      heart: scent.heart_notes || p.notes?.heart || 'Florentine Iris Pallida, May Rose',
      base: scent.base_notes || p.notes?.base || 'Haitian Vetiver, Cedarwood, Oakmoss'
    },
    scentProfile: scent.scent_profile || p.scentProfile || 'Chypre Floral • Velvet Powdery Iris',
    performance: {
      longevity: scent.longevity || p.performance?.longevity || '8-12 Hours',
      sillage: scent.sillage || p.performance?.sillage || 'Intimate & Radiantly Refined',
      concentration: scent.concentration || p.performance?.concentration || 'Parfum Extrait'
    },
    sensory: {
      smellsLike: scent.smells_like || p.sensory?.smellsLike || 'Sophisticated suede notes.',
      whoItsFor: scent.who_its_for || p.sensory?.whoItsFor || 'Designed for individuals who demand craftsmanship.',
      howItEvolves: scent.how_it_evolves || p.sensory?.howItEvolves || 'Opens with crisp notes and blooms into suede iris.'
    },
    description: p.description || ''
  };
};

// Client-side Memory Cache & Request Deduplication
const apiCache = new Map();
const inFlightRequests = new Map();

export const cachedApiCall = async (cacheKey, apiFn, ttlMs = 120000) => {
  const cached = apiCache.get(cacheKey);
  const now = Date.now();

  if (cached && (now - cached.timestamp < ttlMs)) {
    return cached.data;
  }

  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const promise = (async () => {
    try {
      const data = await apiFn();
      if (data !== null && data !== undefined) {
        apiCache.set(cacheKey, { data, timestamp: Date.now() });
      }
      return data;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, promise);
  return promise;
};

export const clearClientCache = (keyPrefix) => {
  if (!keyPrefix) {
    apiCache.clear();
    return;
  }
  for (const key of apiCache.keys()) {
    if (key.startsWith(keyPrefix)) {
      apiCache.delete(key);
    }
  }
};

/**
 * Fetch all products (with optional filters) via POST request
 */
export const fetchProducts = async (filters = {}) => {
  const cacheKey = `products_${JSON.stringify(filters)}`;
  return cachedApiCall(cacheKey, async () => {
    try {
      const response = await apiClient.post('/products/list', filters);
      if (response.data.success) {
        return response.data.products.map(normalizeProduct);
      }
      return [];
    } catch (error) {
      console.error('Error fetching products from backend:', error);
      return [];
    }
  }, 120000);
};

/**
 * Fetch products flagged for Hero Section
 */
export const fetchHeroProducts = async () => {
  const heroProds = await fetchProducts({ isHero: true });
  if (heroProds && heroProds.length > 0) {
    return heroProds;
  }
  // Fallback to all live products from database if no specific hero flag set
  return await fetchProducts();
};

/**
 * Fetch products flagged for Featured / Olfactory Experience Section
 */
export const fetchFeaturedProducts = async () => {
  return await fetchProducts({ isFeatured: true });
};

/**
 * Fetch single product details by ID
 */
export const fetchProductById = async (id) => {
  try {
    const response = await apiClient.post('/products/detail', { id });
    if (response.data.success) {
      return normalizeProduct(response.data.product);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching product ${id} from backend:`, error);
    return null;
  }
};

/**
 * Admin: Toggle product isHero / isFeatured flags
 */
export const toggleProductFlags = async (productId, { isHero, isFeatured }) => {
  try {
    const response = await apiClient.post('/admin/product/toggle-flags', {
      productId,
      isHero,
      isFeatured
    });
    return response.data;
  } catch (error) {
    console.error('Error toggling product flags:', error);
    throw error;
  }
};

/**
 * User Authentication: Login
 */
export const loginUser = async ({ email, password }) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data.success && response.data.session) {
      localStorage.setItem('lune_token', response.data.session.access_token);
      localStorage.setItem('lune_refresh_token', response.data.session.refresh_token);
      localStorage.setItem('lune_user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Login failed' };
  }
};

/**
 * User Authentication: Register
 */
export const registerUser = async ({ email, password, fullName }) => {
  try {
    const response = await apiClient.post('/auth/register', { email, password, fullName });
    if (response.data.success && response.data.session) {
      localStorage.setItem('lune_token', response.data.session.access_token);
      localStorage.setItem('lune_refresh_token', response.data.session.refresh_token);
      localStorage.setItem('lune_user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Registration failed' };
  }
};

/**
 * Refresh expired access token using stored refresh token
 */
export const refreshSessionToken = async () => {
  try {
    const refreshToken = localStorage.getItem('lune_refresh_token');
    if (!refreshToken) return null;

    // Use raw axios instance to prevent interceptor recursion
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    );
    if (response.data.success && response.data.session) {
      const access_token = response.data.session.access_token;
      const new_refresh_token = response.data.session.refresh_token;
      const user = response.data.user;

      if (access_token) localStorage.setItem('lune_token', access_token);
      if (new_refresh_token) localStorage.setItem('lune_refresh_token', new_refresh_token);
      if (user) localStorage.setItem('lune_user', JSON.stringify(user));
      return access_token;
    }
    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    // Only remove session if server explicitly rejects refresh token (401 or 400)
    if (error.response && (error.response.status === 401 || error.response.status === 400)) {
      localStorage.removeItem('lune_token');
      localStorage.removeItem('lune_refresh_token');
      localStorage.removeItem('lune_user');
      window.dispatchEvent(new CustomEvent('lune:auth_logout'));
    }
    return null;
  }
};

/**
 * User Profile: Fetch current user profile details
 */
export const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem('lune_token');
    const refreshToken = localStorage.getItem('lune_refresh_token');
    if (!token && !refreshToken) return null;

    const response = await apiClient.post('/auth/me');
    if (response.data.success) {
      return response.data.profile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

/**
 * User Profile: Update current user profile & shipping details in database
 */
export const updateUserProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('lune_token');
    if (!token) return { success: false, error: 'Authentication required' };
    const response = await apiClient.post(
      '/auth/profile/update',
      profileData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data.success && response.data.user) {
      localStorage.setItem('lune_user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to update profile' };
  }
};

/**
 * User Orders: Place a new order with shipping details
 */
export const placeOrder = async (orderData) => {
  try {
    const token = localStorage.getItem('lune_token');
    if (!token) return { success: false, error: 'Authentication required' };
    const response = await apiClient.post(
      '/orders/create',
      orderData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to place order' };
  }
};

const getCartAuthHeaders = () => {
  const token = localStorage.getItem('lune_token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};


/**
 * User Cart: Fetch live cart items from database for authenticated or guest user
 */
export const fetchUserCart = async () => {
  try {
    const response = await apiClient.post(
      '/cart/get',
      {},
      { headers: getCartAuthHeaders() }
    );
    if (response.data.success && Array.isArray(response.data.cart)) {
      return response.data.cart.map(dbItem => {
        const prod = normalizeProduct(dbItem.product);
        if (!prod) return null;

        // Resolve size pricing
        const selectedSize = dbItem.selected_size;
        const matchingSizeObj = (prod.sizes || []).find(s => s.size === selectedSize) || {
          size: selectedSize || 'Full Size Flacon',
          price: prod.price
        };

        return {
          dbId: dbItem.id, // Primary key in database
          id: dbItem.id,
          product: prod,
          size: matchingSizeObj,
          price: matchingSizeObj.price || prod.price,
          quantity: dbItem.quantity,
          engraving: dbItem.engraving_text || ''
        };
      }).filter(Boolean);
    }
    return [];
  } catch (error) {
    console.error('Error fetching live cart from database:', error);
    return [];
  }
};

/**
 * User Cart: Add item to live database cart
 */
export const addToUserCart = async ({ productId, selectedSize, quantity = 1, engravingText = null }) => {
  try {
    const sizeValue = typeof selectedSize === 'string' ? selectedSize : (selectedSize?.size || 'Full Size Flacon');
    const response = await apiClient.post(
      '/cart/add',
      { productId: String(productId), selectedSize: sizeValue, quantity, engravingText: engravingText || undefined },
      { headers: getCartAuthHeaders() }
    );
    return response.data.success;
  } catch (error) {
    console.error('Error adding to database cart:', error);
    return false;
  }
};


/**
 * User Cart: Update quantity of item in database cart
 */
export const updateUserCartQuantity = async (dbId, quantity) => {
  try {
    const response = await apiClient.post(
      '/cart/update',
      { id: dbId, quantity },
      { headers: getCartAuthHeaders() }
    );
    return response.data.success;
  } catch (error) {
    console.error('Error updating cart item quantity in database:', error);
    return false;
  }
};

/**
 * User Cart: Remove item from database cart
 */
export const removeFromUserCart = async (dbId) => {
  try {
    const response = await apiClient.post(
      '/cart/remove',
      { id: dbId },
      { headers: getCartAuthHeaders() }
    );
    return response.data.success;
  } catch (error) {
    console.error('Error removing item from database cart:', error);
    return false;
  }
};

/**
 * User Cart: Clear entire database cart
 */
export const clearUserCart = async () => {
  try {
    const response = await apiClient.post(
      '/cart/clear',
      {},
      { headers: getCartAuthHeaders() }
    );
    return response.data.success;
  } catch (error) {
    console.error('Error clearing cart in database:', error);
    return false;
  }
};



/**
 * User Orders: Fetch live orders for authenticated user
 */
export const fetchUserOrders = async () => {
  try {
    const token = localStorage.getItem('lune_token');
    if (!token) return [];
    const response = await apiClient.post(
      '/orders/list',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data.success) {
      return response.data.orders || [];
    }
    return [];
  } catch (error) {
    if (error.response?.status === 401) return [];
    console.error('Error fetching user orders:', error);
    return [];
  }
};

/**
 * User Wishlist: Fetch live wishlist items for authenticated user
 */
export const fetchUserWishlist = async () => {
  try {
    const token = localStorage.getItem('lune_token');
    if (!token) return [];
    const response = await apiClient.post(
      '/wishlist/list',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data.success) {
      return (response.data.wishlist || []).map(w => normalizeProduct(w.product)).filter(Boolean);
    }
    return [];
  } catch (error) {
    if (error.response?.status === 401) return [];
    console.error('Error fetching wishlist:', error);
    return [];
  }
};

/**
 * User Wishlist: Add or remove item
 */
export const toggleWishlistItem = async (productId, isWishlisted) => {
  try {
    const token = localStorage.getItem('lune_token');
    if (!token) return false;
    const endpoint = isWishlisted ? '/wishlist/remove' : '/wishlist/add';
    const response = await apiClient.post(
      endpoint,
      { productId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.success;
  } catch (error) {
    console.error('Error toggling wishlist item:', error);
    return false;
  }
};

/**
 * Validate Promo Discount Code
 */
export const validateDiscountCode = async (code) => {
  const cleanCode = (code || '').trim().toUpperCase();
  try {
    const response = await apiClient.post('/discounts/validate', { code: cleanCode });
    if (response.data && (response.data.success || response.data.valid)) {
      return response.data;
    }
  } catch (error) {
    // proceed to fallback check
  }

  const STATIC_CODES = { 'TEST100': 100, 'WELCOME15': 15, 'HAUTE20': 20, 'LUNE10': 10, 'PARFUM20': 20, 'PRIVILEGE25': 25 };
  if (STATIC_CODES[cleanCode] !== undefined) {
    return {
      success: true,
      valid: true,
      discount: { code: cleanCode, percentage: STATIC_CODES[cleanCode] }
    };
  }

  return { success: false, valid: false, message: 'Invalid discount code' };
};


/**
 * Admin: Create New Product
 */
export const createProduct = async (productData) => {
  try {
    const token = localStorage.getItem('lune_token');
    const response = await apiClient.post('/products/create', productData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    clearClientCache('products');
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to create product' };
  }
};

/**
 * Admin: Update Product
 */
export const updateProduct = async (productData) => {
  try {
    const token = localStorage.getItem('lune_token');
    const response = await apiClient.post('/products/update', productData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    clearClientCache('products');
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to update product' };
  }
};

/**
 * Admin: Delete Product
 */
export const deleteProduct = async (productId) => {
  try {
    const token = localStorage.getItem('lune_token');
    const response = await apiClient.post('/products/delete', { id: productId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    clearClientCache('products');
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to delete product' };
  }
};

/**
 * Admin: Toggle Product Active/Inactive Status
 */
export const toggleProductStockStatus = async (productId, inStock) => {
  try {
    const token = localStorage.getItem('lune_token');
    let response;
    try {
      response = await apiClient.post('/admin/product/toggle-stock', { id: productId, inStock }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      response = await apiClient.post('/products/toggle-stock', { id: productId, inStock }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    clearClientCache('products');
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to toggle product status' };
  }
};

/**
 * Admin: Category Management API
 */
export const fetchCategories = async () => {
  return cachedApiCall('categories_all', async () => {
    try {
      const response = await apiClient.post('/admin/categories/list', {});
      return response.data.categories || [];
    } catch (error) {
      return [];
    }
  }, 180000);
};

export const createCategory = async (catData) => {
  try {
    const token = localStorage.getItem('lune_token');
    const response = await apiClient.post('/admin/categories/create', catData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    clearClientCache('categories');
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to create category' };
  }
};

export const updateCategory = async (catData) => {
  try {
    const token = localStorage.getItem('lune_token');
    const response = await apiClient.post('/admin/categories/update', catData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    clearClientCache('categories');
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to update category' };
  }
};

export const deleteCategory = async (id) => {
  try {
    const token = localStorage.getItem('lune_token');
    const response = await apiClient.post('/admin/categories/delete', { id }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    clearClientCache('categories');
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to delete category' };
  }
};

/**
 * Admin: Discount / Coupon Management API
 */
export const fetchDiscounts = async () => {
  try {
    const token = localStorage.getItem('lune_token');
    const response = await apiClient.post('/admin/discounts/list', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.discounts || [];
  } catch (error) {
    return [];
  }
};

export const createDiscount = async (couponData) => {
  try {
    const token = localStorage.getItem('lune_token');
    const response = await apiClient.post('/admin/discounts/create', couponData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to create coupon' };
  }
};

export const updateDiscount = async (couponData) => {
  try {
    const token = localStorage.getItem('lune_token');
    const response = await apiClient.post('/admin/discounts/update', couponData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to update coupon' };
  }
};

export const deleteDiscount = async (id) => {
  try {
    const token = localStorage.getItem('lune_token');
    const response = await apiClient.post('/admin/discounts/delete', { id }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to delete coupon' };
  }
};

/**
 * Admin: Fetch ALL reviews across all products
 */
export const fetchAllReviews = async () => {
  try {
    const token = localStorage.getItem('lune_token');
    const response = await apiClient.post('/admin/reviews/list', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.reviews || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

/**
 * Admin: Delete a review by ID
 */
export const deleteReviewById = async (id) => {
  try {
    const token = localStorage.getItem('lune_token');
    const response = await apiClient.post('/admin/reviews/delete', { id }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to delete review' };
  }
};

/**
 * Public: Submit a contact/support message
 */
export const submitContactMessage = async ({ fullName, email, subject, message }) => {
  try {
    const response = await apiClient.post('/contact/submit', { fullName, email, subject, message });
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to send message' };
  }
};

/**
 * Admin: Fetch all contact/support messages
 */
export const fetchContactMessages = async () => {
  try {
    const token = localStorage.getItem('lune_token');
    const response = await apiClient.post('/admin/contacts/list', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.messages || [];
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return [];
  }
};

/**
 * Admin: Update contact message status
 */
export const updateContactStatus = async (id, status) => {
  try {
    const token = localStorage.getItem('lune_token');
    const response = await apiClient.post('/admin/contacts/update-status', { id, status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to update status' };
  }
};

/**
 * Admin: Delete a contact message
 */
export const deleteContactMsg = async (id) => {
  try {
    const token = localStorage.getItem('lune_token');
    const response = await apiClient.post('/admin/contacts/delete', { id }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to delete message' };
  }
};

/**
 * Admin: Fetch all customer orders
 */
export const fetchAllOrdersAdmin = async () => {
  try {
    const token = localStorage.getItem('lune_token');
    const response = await apiClient.post('/admin/orders/list', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.orders || [];
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return [];
  }
};

/**
 * Admin: Update order stage status
 */
export const updateOrderStatusAdmin = async (orderId, status) => {
  try {
    const token = localStorage.getItem('lune_token');
    const response = await apiClient.post('/admin/orders/update-status', { orderId, status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to update order status' };
  }
};



