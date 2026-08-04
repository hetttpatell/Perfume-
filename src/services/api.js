import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

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

  const rawMain = images.find(img => img.is_primary)?.image_url || p.image_url || p.image;
  const mainImage = resolveImgPath(rawMain);

  // Merge images from product_images table rows AND gallery_images JSON column,
  // then deduplicate so every uploaded sub-image appears in the gallery.
  // Primary/main image is always placed first.
  const fromTable = images.map(img => img.image_url).filter(Boolean);
  const fromColumn = Array.isArray(p.gallery_images) ? p.gallery_images : (Array.isArray(p.galleryImages) ? p.galleryImages : []);
  const merged = [...new Set([...fromTable, ...fromColumn])];
  const subImages = merged.filter(url => url !== rawMain);
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

/**
 * Fetch all products (with optional filters) via POST request
 */
export const fetchProducts = async (filters = {}) => {
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
};

/**
 * Fetch products flagged for Hero Section
 */
export const fetchHeroProducts = async () => {
  return await fetchProducts({ isHero: true });
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

    const response = await apiClient.post('/auth/refresh', { refreshToken });
    if (response.data.success && response.data.session) {
      localStorage.setItem('lune_token', response.data.session.access_token);
      localStorage.setItem('lune_refresh_token', response.data.session.refresh_token);
      localStorage.setItem('lune_user', JSON.stringify(response.data.user));
      return response.data.session.access_token;
    }
    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    localStorage.removeItem('lune_token');
    localStorage.removeItem('lune_refresh_token');
    localStorage.removeItem('lune_user');
    return null;
  }
};

/**
 * User Profile: Fetch current user profile details
 */
export const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem('lune_token');
    if (!token) return null;
    const response = await apiClient.post(
      '/auth/me',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data.success) {
      return response.data.profile;
    }
    return null;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('lune_token');
      return null;
    }
    console.error('Error fetching user profile:', error);
    return null;
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
  try {
    const response = await apiClient.post('/discounts/validate', { code });
    return response.data;
  } catch (error) {
    return { success: false, valid: false, message: 'Invalid or expired code' };
  }
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
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to toggle product status' };
  }
};

/**
 * Admin: Category Management API
 */
export const fetchCategories = async () => {
  try {
    const token = localStorage.getItem('lune_token');
    const response = await apiClient.post('/admin/categories/list', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.categories || [];
  } catch (error) {
    return [];
  }
};

export const createCategory = async (catData) => {
  try {
    const token = localStorage.getItem('lune_token');
    const response = await apiClient.post('/admin/categories/create', catData, {
      headers: { Authorization: `Bearer ${token}` }
    });
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

// Response interceptor to handle token expiration & automatic silent refreshes
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 Unauthorized, and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't loop on refresh or login endpoints
      if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      try {
        const newToken = await refreshSessionToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          // Also rebuild headers on subsequent requests using config
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshErr) {
        console.error('Session refresh failed:', refreshErr);
      }
    }
    return Promise.reject(error);
  }
);
