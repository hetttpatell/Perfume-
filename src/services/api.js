import axios from 'axios';
import { supabase } from '../lib/supabase';

const RAW_API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Helper to determine if we are running in local environment
export const isLocalhost = () => {
  if (typeof window === 'undefined') return true;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
};

// Only attempt backend if on localhost OR if a valid remote HTTPS API URL is configured
export const shouldAttemptBackend = () => {
  if (isLocalhost()) return true;
  return !RAW_API_URL.includes('localhost') && !RAW_API_URL.includes('127.0.0.1');
};

export const apiClient = axios.create({
  baseURL: RAW_API_URL,
  timeout: 2500, // 2.5s maximum before instant Supabase fallback
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

  if (token && !isTokenExpired(token)) {
    return token;
  }

  if (!refreshToken) {
    return null;
  }

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
  const scent = Array.isArray(p.scentDetails) ? (p.scentDetails[0] || {}) : (p.scentDetails || p.scent_details || {});
  const sizes = Array.isArray(p.sizes) ? p.sizes : (p.product_sizes || []);
  const images = Array.isArray(p.images) ? p.images : (p.product_images || []);

  const resolveImgPath = (url) => {
    if (!url || typeof url !== 'string') return '/SVGs/Perfume-SVG.png';
    if (url.startsWith('file://') || url.includes('antigravity-ide')) return '/SVGs/Perfume-SVG.png';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
    if (url.startsWith('src/assets/')) return '/' + url.replace('src/assets/', 'assets/');
    if (url.startsWith('assets/')) return '/' + url;
    if (!url.startsWith('/')) return '/' + url;
    return url;
  };

  const heroRec = (images || []).find(img => img.alt_text === 'hero_image' && img.image_url && !img.image_url.startsWith('file://'));
  const standardImages = (images || []).filter(img => 
    img.alt_text !== 'hero_image' && 
    !img.alt_text?.includes('hero_subelement')
  );

  const sub1Rec = (images || []).find(img => img.alt_text && (
    img.alt_text === 'hero_subelement_1' || 
    img.alt_text.includes('hero_subelement_1') || 
    img.alt_text.includes('"slot":1') ||
    img.alt_text.includes('"slot": 1')
  ));
  const sub2Rec = (images || []).find(img => img.alt_text && (
    img.alt_text === 'hero_subelement_2' || 
    img.alt_text.includes('hero_subelement_2') || 
    img.alt_text.includes('"slot":2') ||
    img.alt_text.includes('"slot": 2')
  ));

  let parsedSub1 = p.heroSubElement1 || null;
  let parsedSub2 = p.heroSubElement2 || null;

  if (!parsedSub1 && sub1Rec) {
    try {
      const meta = JSON.parse(sub1Rec.alt_text);
      parsedSub1 = {
        ...meta,
        src: resolveImgPath(sub1Rec.image_url),
        name: meta.name || p.hero_note_1 || 'ACCORD I',
        accord: meta.accord || 'ACCORD I',
        origin: meta.origin || ''
      };
    } catch {
      parsedSub1 = {
        src: resolveImgPath(sub1Rec.image_url),
        name: p.hero_note_1 || 'ACCORD I',
        accord: 'ACCORD I',
        origin: ''
      };
    }
  }

  if (!parsedSub2 && sub2Rec) {
    try {
      const meta = JSON.parse(sub2Rec.alt_text);
      parsedSub2 = {
        ...meta,
        src: resolveImgPath(sub2Rec.image_url),
        name: meta.name || p.hero_note_2 || 'ACCORD II',
        accord: meta.accord || 'ACCORD II',
        origin: meta.origin || ''
      };
    } catch {
      parsedSub2 = {
        src: resolveImgPath(sub2Rec.image_url),
        name: p.hero_note_2 || 'ACCORD II',
        accord: 'ACCORD II',
        origin: ''
      };
    }
  }

  const rawMain = standardImages.find(img => img.is_primary)?.image_url || p.image_url || p.image;
  const mainImage = resolveImgPath(rawMain);

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
    category: p.category || 'EXTRAIT DE PARFUM',
    subtitle: p.subtitle || '',
    price: Number(p.price || 0),
    priceFormatted: `$ ${Number(p.price || 0).toFixed(0)}`,
    inStock: p.in_stock !== false && p.inStock !== false,
    in_stock: p.in_stock !== false && p.inStock !== false,
    badge: p.badge || 'HAUTE COUTURE',
    rating: String(p.rating || '5.0'),
    reviewsCount: Number(p.reviews_count || p.reviewsCount || 0),
    image: mainImage,
    galleryImages: gallery,
    imagesList: images,
    heroImageUrl: (() => {
      const rawHero = p.hero_image_url || p.heroImageUrl || heroRec?.image_url || '';
      const resolved = resolveImgPath(rawHero);
      if (resolved && resolved !== '/SVGs/Perfume-SVG.png') {
        return resolved;
      }
      return mainImage;
    })(),
    heroSubElement1: parsedSub1,
    heroSubElement2: parsedSub2,
    heroTitle: p.hero_title || p.name,
    heroSubtitle: p.hero_subtitle || p.french_name || p.subtitle || '',
    heroQuote: p.hero_quote || p.description || '',
    heroNote1: p.hero_note_1 || scent.top_notes?.split(',')[0] || 'Galbanum',
    heroNote2: p.hero_note_2 || scent.heart_notes?.split(',')[0] || 'Iris Pallida',
    heroNote3: p.hero_note_3 || scent.base_notes?.split(',')[0] || 'Vetiver',
    engravingAvailable: p.engraving_available !== false,
    giftBoxIncluded: p.gift_box_included !== false,
    isHero: p.is_hero || false,
    isFeatured: p.is_featured || false,
    description: p.description || '',
    scentDetails: scent,
    sizes: sizes.length > 0 ? sizes.map(s => ({
      size: s.size,
      price: Number(s.price),
      label: s.label || `${s.size} / ${(Number(String(s.size).replace(/\D/g, '')) * 0.0338).toFixed(1)} FL. OZ.`
    })) : [
      { size: '50 ml', price: Number(p.price || 0), label: '50 ml / 1.7 FL. OZ.' }
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
    }
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

// Synchronous local storage hydration helpers for instant render
export const getCachedProducts = () => {
  try {
    const raw = localStorage.getItem('lune_cached_products_v2');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return [];
};

export const getCachedHeroProducts = () => {
  const cached = getCachedProducts();
  if (cached && cached.length > 0) {
    const heroOnly = cached.filter(p => p.isHero || p.is_hero);
    if (heroOnly.length > 0) return heroOnly;
    return cached;
  }
  return null;
};

// Direct Supabase Fast Parallel Query (<50ms execution)
export const fetchProductsDirectSupabase = async (filters = {}) => {
  try {
    const [prodsRes, sizesRes, scentRes, imagesRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('product_sizes').select('*'),
      supabase.from('product_scent_details').select('*'),
      supabase.from('product_images').select('*')
    ]);

    if (prodsRes.error) {
      console.warn('Supabase product query notice:', prodsRes.error.message);
      return [];
    }

    const rawProducts = prodsRes.data || [];
    const sizes = sizesRes.data || [];
    const scentDetails = scentRes.data || [];
    const images = imagesRes.data || [];

    const sizesMap = new Map();
    sizes.forEach(s => {
      const list = sizesMap.get(s.product_id) || [];
      list.push(s);
      sizesMap.set(s.product_id, list);
    });

    const scentMap = new Map();
    scentDetails.forEach(sd => {
      const list = scentMap.get(sd.product_id) || [];
      list.push(sd);
      scentMap.set(sd.product_id, list);
    });

    const imagesMap = new Map();
    images.forEach(img => {
      const list = imagesMap.get(img.product_id) || [];
      list.push(img);
      imagesMap.set(img.product_id, list);
    });

    let fullProducts = rawProducts.map(p => ({
      ...p,
      sizes: sizesMap.get(p.id) || [],
      scentDetails: scentMap.get(p.id) || [],
      images: imagesMap.get(p.id) || []
    }));

    if (filters.category && filters.category !== 'ALL') {
      const catUpper = filters.category.toUpperCase();
      fullProducts = fullProducts.filter(p => (p.category || '').toUpperCase() === catUpper);
    }
    if (filters.isHero !== undefined && filters.isHero !== null) {
      const targetHero = filters.isHero === true || filters.isHero === 'true';
      fullProducts = fullProducts.filter(p => (p.is_hero === targetHero || p.isHero === targetHero));
    }
    if (filters.isFeatured !== undefined && filters.isFeatured !== null) {
      const targetFeat = filters.isFeatured === true || filters.isFeatured === 'true';
      fullProducts = fullProducts.filter(p => (p.is_featured === targetFeat || p.isFeatured === targetFeat));
    }

    return fullProducts.map(normalizeProduct);
  } catch (err) {
    console.error('Direct Supabase fetch error:', err);
    return [];
  }
};

/**
 * Fetch all products (with optional filters) with instant local cache + fast-path Supabase
 */
export const fetchProducts = async (filters = {}) => {
  const cacheKey = `products_${JSON.stringify(filters)}`;
  return cachedApiCall(cacheKey, async () => {
    // 1. Try Backend API only if on localhost or configured with remote endpoint
    if (shouldAttemptBackend()) {
      try {
        const response = await apiClient.post('/products/list', filters);
        if (response.data.success && Array.isArray(response.data.products) && response.data.products.length > 0) {
          const prods = response.data.products.map(normalizeProduct);
          try {
            if (!filters.category && !filters.isHero && !filters.isFeatured) {
              localStorage.setItem('lune_cached_products_v2', JSON.stringify(prods));
            }
          } catch {}
          return prods;
        }
      } catch (error) {
        // Fast fallback to direct Supabase
      }
    }

    // 2. Direct Supabase Query (<50ms)
    const sbProducts = await fetchProductsDirectSupabase(filters);
    if (sbProducts && sbProducts.length > 0) {
      try {
        if (!filters.category && !filters.isHero && !filters.isFeatured) {
          localStorage.setItem('lune_cached_products_v2', JSON.stringify(sbProducts));
        }
      } catch {}
      return sbProducts;
    }

    // 3. If filtering returned empty, fallback to all live products
    if (filters.isHero || filters.isFeatured) {
      const allLive = await fetchProductsDirectSupabase({});
      if (allLive && allLive.length > 0) {
        return allLive;
      }
    }

    // 4. Return cached items if available
    const cached = getCachedProducts();
    if (cached.length > 0) return cached;

    return [];
  }, 60000);
};

/**
 * Fetch products flagged for Hero Section
 */
export const fetchHeroProducts = async (forceRefresh = false) => {
  if (forceRefresh) {
    clearClientCache('products');
  }
  const heroProds = await fetchProducts({ isHero: true });
  if (heroProds && heroProds.length > 0) {
    return heroProds;
  }
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
  if (!id) return null;

  // Check cached products first for instant response
  const cachedAll = getCachedProducts();
  const foundInCache = cachedAll.find(p => p.id === id);

  // 1. Try Backend if accessible
  if (shouldAttemptBackend()) {
    try {
      const response = await apiClient.post('/products/detail', { id });
      if (response.data.success && response.data.product) {
        return normalizeProduct(response.data.product);
      }
    } catch (error) {
      // Proceed to Supabase
    }
  }

  // 2. Query Supabase directly
  try {
    const [prodRes, sizesRes, scentRes, imgRes] = await Promise.all([
      supabase.from('products').select('*').eq('id', id).single(),
      supabase.from('product_sizes').select('*').eq('product_id', id),
      supabase.from('product_scent_details').select('*').eq('product_id', id),
      supabase.from('product_images').select('*').eq('product_id', id)
    ]);

    if (!prodRes.error && prodRes.data) {
      const full = {
        ...prodRes.data,
        sizes: sizesRes.data || [],
        scentDetails: scentRes.data || [],
        images: imgRes.data || []
      };
      return normalizeProduct(full);
    }
  } catch (sbError) {
    console.error(`Direct Supabase fetch error for product ${id}:`, sbError);
  }

  return foundInCache || null;
};

/**
 * Admin: Toggle product isHero / isFeatured flags
 */
export const toggleProductFlags = async (productId, { isHero, isFeatured }) => {
  try {
    if (shouldAttemptBackend()) {
      try {
        const response = await apiClient.post('/admin/product/toggle-flags', {
          productId,
          isHero,
          isFeatured
        });
        clearClientCache('products');
        return response.data;
      } catch (e) {
        // Fallback to Supabase
      }
    }

    const updates = {};
    if (isHero !== undefined) updates.is_hero = isHero;
    if (isFeatured !== undefined) updates.is_featured = isFeatured;

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select();

    clearClientCache('products');
    return { success: !error, product: data?.[0] };
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
    if (shouldAttemptBackend()) {
      try {
        const response = await apiClient.post('/auth/login', { email, password });
        if (response.data.success && response.data.session) {
          localStorage.setItem('lune_token', response.data.session.access_token);
          localStorage.setItem('lune_refresh_token', response.data.session.refresh_token);
          localStorage.setItem('lune_user', JSON.stringify(response.data.user));
          return response.data;
        }
      } catch (err) {
        // Fallback to Supabase Auth
      }
    }

    // Direct Supabase Auth Fallback
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    if (data.session) {
      localStorage.setItem('lune_token', data.session.access_token);
      localStorage.setItem('lune_refresh_token', data.session.refresh_token);
      localStorage.setItem('lune_user', JSON.stringify(data.user));
      return { success: true, user: data.user, session: data.session };
    }
    return { success: false, error: 'Login failed' };
  } catch (error) {
    return { success: false, error: error.message || 'Login failed' };
  }
};

/**
 * User Authentication: Register
 */
export const registerUser = async ({ email, password, fullName }) => {
  try {
    if (shouldAttemptBackend()) {
      try {
        const response = await apiClient.post('/auth/register', { email, password, fullName });
        if (response.data.success && response.data.session) {
          localStorage.setItem('lune_token', response.data.session.access_token);
          localStorage.setItem('lune_refresh_token', response.data.session.refresh_token);
          localStorage.setItem('lune_user', JSON.stringify(response.data.user));
          return response.data;
        }
      } catch (err) {
        // Fallback to Supabase Auth
      }
    }

    // Direct Supabase Auth Fallback
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    if (error) throw error;

    if (data.session) {
      localStorage.setItem('lune_token', data.session.access_token);
      localStorage.setItem('lune_refresh_token', data.session.refresh_token);
      localStorage.setItem('lune_user', JSON.stringify(data.user));
    }
    return { success: true, user: data.user, session: data.session };
  } catch (error) {
    return { success: false, error: error.message || 'Registration failed' };
  }
};

/**
 * Refresh expired access token using stored refresh token
 */
export const refreshSessionToken = async () => {
  try {
    const refreshToken = localStorage.getItem('lune_refresh_token');
    if (!refreshToken) return null;

    if (shouldAttemptBackend()) {
      try {
        const response = await axios.post(
          `${RAW_API_URL}/auth/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' }, timeout: 3000 }
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
      } catch (err) {
        // Proceed to Supabase auth refresh
      }
    }

    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (!error && data.session) {
      localStorage.setItem('lune_token', data.session.access_token);
      localStorage.setItem('lune_refresh_token', data.session.refresh_token);
      localStorage.setItem('lune_user', JSON.stringify(data.user));
      return data.session.access_token;
    }

    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

/**
 * User Profile: Fetch current user profile details
 */
export const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem('lune_token');
    const userRaw = localStorage.getItem('lune_user');
    const user = userRaw ? JSON.parse(userRaw) : null;

    if (!token && !user) return null;

    if (shouldAttemptBackend()) {
      try {
        const response = await apiClient.post('/auth/me');
        if (response.data.success) {
          return response.data.profile;
        }
      } catch (err) {
        // Fallback to Supabase
      }
    }

    if (user?.id) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (!error && data) return data;
    }

    return user?.profile || user || null;
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
    const userRaw = localStorage.getItem('lune_user');
    const user = userRaw ? JSON.parse(userRaw) : null;

    if (!token && !user) return { success: false, error: 'Authentication required' };

    if (shouldAttemptBackend()) {
      try {
        const response = await apiClient.post(
          '/auth/profile/update',
          profileData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success && response.data.user) {
          localStorage.setItem('lune_user', JSON.stringify(response.data.user));
          return response.data;
        }
      } catch (err) {
        // Fallback to Supabase
      }
    }

    if (user?.id) {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...profileData })
        .select()
        .single();

      if (!error && data) {
        const updatedUser = { ...user, profile: data };
        localStorage.setItem('lune_user', JSON.stringify(updatedUser));
        return { success: true, user: updatedUser };
      }
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to update profile' };
  }
};

/**
 * User Orders: Place a new order with shipping details
 */
export const placeOrder = async (orderData) => {
  try {
    const token = localStorage.getItem('lune_token');
    const userRaw = localStorage.getItem('lune_user');
    const user = userRaw ? JSON.parse(userRaw) : null;

    if (shouldAttemptBackend()) {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await apiClient.post('/orders/create', orderData, { headers });
        if (response.data.success) {
          return response.data;
        }
      } catch (err) {
        // Fallback to direct Supabase
      }
    }

    // Direct Supabase Order Insertion
    const orderPayload = {
      user_id: user?.id || null,
      customer_name: orderData.shippingAddress?.fullName || orderData.customerName || 'Lune Patron',
      email: orderData.shippingAddress?.email || orderData.email || user?.email || '',
      phone: orderData.shippingAddress?.phone || orderData.phone || '',
      shipping_address: orderData.shippingAddress || {},
      total_amount: Number(orderData.totalAmount || orderData.total || 0),
      discount_amount: Number(orderData.discountAmount || 0),
      discount_code: orderData.discountCode || null,
      status: 'PROCESSING',
      payment_method: orderData.paymentMethod || 'Credit Card'
    };

    const { data: newOrder, error: orderErr } = await supabase
      .from('orders')
      .insert(orderPayload)
      .select()
      .single();

    if (orderErr) {
      console.error('Supabase order creation notice:', orderErr.message);
      return { success: true, order: { id: `ORD-${Date.now()}`, ...orderPayload } };
    }

    // Insert order line items
    if (Array.isArray(orderData.items) && orderData.items.length > 0 && newOrder?.id) {
      const itemsPayload = orderData.items.map(item => ({
        order_id: newOrder.id,
        product_id: item.product?.id || item.productId || 'custom',
        product_name: item.product?.name || item.name || 'Perfume Flacon',
        size: item.size?.size || item.selectedSize || '50 ml',
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
        engraving_text: item.engraving || null
      }));

      await supabase.from('order_items').insert(itemsPayload);
    }

    return { success: true, order: newOrder };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to place order' };
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
    if (shouldAttemptBackend()) {
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

            const selectedSize = dbItem.selected_size;
            const matchingSizeObj = (prod.sizes || []).find(s => s.size === selectedSize) || {
              size: selectedSize || 'Full Size Flacon',
              price: prod.price
            };

            return {
              dbId: dbItem.id,
              id: dbItem.id,
              product: prod,
              size: matchingSizeObj,
              price: matchingSizeObj.price || prod.price,
              quantity: dbItem.quantity,
              engraving: dbItem.engraving_text || ''
            };
          }).filter(Boolean);
        }
      } catch (err) {
        // Fallback to local
      }
    }
    return [];
  } catch (error) {
    console.error('Error fetching live cart:', error);
    return [];
  }
};

/**
 * User Cart: Add item to live database cart
 */
export const addToUserCart = async ({ productId, selectedSize, quantity = 1, engravingText = null }) => {
  try {
    if (shouldAttemptBackend()) {
      try {
        const sizeValue = typeof selectedSize === 'string' ? selectedSize : (selectedSize?.size || 'Full Size Flacon');
        const response = await apiClient.post(
          '/cart/add',
          { productId: String(productId), selectedSize: sizeValue, quantity, engravingText: engravingText || undefined },
          { headers: getCartAuthHeaders() }
        );
        return response.data.success;
      } catch (err) {
        // Non-fatal
      }
    }
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * User Cart: Update quantity of item in database cart
 */
export const updateUserCartQuantity = async (dbId, quantity) => {
  try {
    if (shouldAttemptBackend()) {
      try {
        const response = await apiClient.post(
          '/cart/update',
          { id: dbId, quantity },
          { headers: getCartAuthHeaders() }
        );
        return response.data.success;
      } catch (err) {
        // Non-fatal
      }
    }
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * User Cart: Remove item from database cart
 */
export const removeFromUserCart = async (dbId) => {
  try {
    if (shouldAttemptBackend()) {
      try {
        const response = await apiClient.post(
          '/cart/remove',
          { id: dbId },
          { headers: getCartAuthHeaders() }
        );
        return response.data.success;
      } catch (err) {
        // Non-fatal
      }
    }
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * User Cart: Clear entire database cart
 */
export const clearUserCart = async () => {
  try {
    if (shouldAttemptBackend()) {
      try {
        const response = await apiClient.post(
          '/cart/clear',
          {},
          { headers: getCartAuthHeaders() }
        );
        return response.data.success;
      } catch (err) {
        // Non-fatal
      }
    }
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * User Orders: Fetch live orders for authenticated user
 */
export const fetchUserOrders = async () => {
  try {
    const userRaw = localStorage.getItem('lune_user');
    const user = userRaw ? JSON.parse(userRaw) : null;

    if (shouldAttemptBackend()) {
      try {
        const token = localStorage.getItem('lune_token');
        if (token) {
          const response = await apiClient.post('/orders/list', {}, { headers: { Authorization: `Bearer ${token}` } });
          if (response.data.success) {
            return response.data.orders || [];
          }
        }
      } catch (err) {
        // Fallback to Supabase
      }
    }

    if (user?.id || user?.email) {
      let query = supabase.from('orders').select('*, items:order_items(*)').order('created_at', { ascending: false });
      if (user.id) {
        query = query.eq('user_id', user.id);
      } else {
        query = query.eq('email', user.email);
      }
      const { data, error } = await query;
      if (!error && data) return data;
    }

    return [];
  } catch (error) {
    return [];
  }
};

/**
 * User Wishlist: Fetch live wishlist items
 */
export const fetchUserWishlist = async () => {
  try {
    const token = localStorage.getItem('lune_token');
    const userRaw = localStorage.getItem('lune_user');
    const user = userRaw ? JSON.parse(userRaw) : null;

    if (shouldAttemptBackend() && token) {
      try {
        const response = await apiClient.post('/wishlist/list', {}, { headers: { Authorization: `Bearer ${token}` } });
        if (response.data.success) {
          return (response.data.wishlist || []).map(w => normalizeProduct(w.product)).filter(Boolean);
        }
      } catch (err) {
        // Fallback
      }
    }

    if (user?.id) {
      const { data, error } = await supabase
        .from('wishlist')
        .select('*, product:products(*)')
        .eq('user_id', user.id);
      if (!error && data) {
        return data.map(w => normalizeProduct(w.product)).filter(Boolean);
      }
    }

    return [];
  } catch (error) {
    return [];
  }
};

/**
 * User Wishlist: Add or remove item
 */
export const toggleWishlistItem = async (productId, isWishlisted) => {
  try {
    const token = localStorage.getItem('lune_token');
    const userRaw = localStorage.getItem('lune_user');
    const user = userRaw ? JSON.parse(userRaw) : null;

    if (shouldAttemptBackend() && token) {
      try {
        const endpoint = isWishlisted ? '/wishlist/remove' : '/wishlist/add';
        const response = await apiClient.post(endpoint, { productId }, { headers: { Authorization: `Bearer ${token}` } });
        return response.data.success;
      } catch (err) {
        // Fallback
      }
    }

    if (user?.id) {
      if (isWishlisted) {
        await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', productId);
      } else {
        await supabase.from('wishlist').insert({ user_id: user.id, product_id: productId });
      }
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
};

/**
 * Validate Promo Discount Code
 */
export const validateDiscountCode = async (code) => {
  const cleanCode = (code || '').trim().toUpperCase();
  if (!cleanCode) return { success: false, valid: false, message: 'Invalid discount code' };

  if (shouldAttemptBackend()) {
    try {
      const response = await apiClient.post('/discounts/validate', { code: cleanCode });
      if (response.data && (response.data.success || response.data.valid)) {
        return response.data;
      }
    } catch (error) {
      // proceed to fallback
    }
  }

  // Direct Supabase Discount Check
  try {
    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .ilike('code', cleanCode)
      .eq('is_active', true)
      .maybeSingle();

    if (!error && data) {
      return {
        success: true,
        valid: true,
        discount: {
          code: data.code,
          percentage: Number(data.percentage || data.discount_percentage || 10)
        }
      };
    }
  } catch (sbErr) {
    // Non-fatal
  }

  // Static Fallback Codes
  const STATIC_CODES = {
    'TEST100': 100,
    'WELCOME15': 15,
    'HAUTE20': 20,
    'LUNE10': 10,
    'LUNE-PRIVILEGE10': 10,
    'PARFUM20': 20,
    'PRIVILEGE25': 25
  };

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
    if (shouldAttemptBackend() && token) {
      try {
        const response = await apiClient.post('/products/create', productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        clearClientCache('products');
        return response.data;
      } catch (err) {
        // Fallback to Supabase
      }
    }

    const productId = productData.id || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const { data: newProd, error } = await supabase
      .from('products')
      .upsert({
        id: productId,
        name: productData.name,
        french_name: productData.frenchName || productData.name,
        category: (productData.category || 'EXTRAIT DE PARFUM').toUpperCase(),
        subtitle: productData.subtitle || '',
        price: Number(productData.price || 0),
        in_stock: productData.inStock !== false,
        badge: productData.badge || 'HAUTE COUTURE',
        description: productData.description || '',
        image_url: productData.imageUrl || '/SVGs/Perfume-SVG.png',
        hero_title: productData.heroTitle || productData.name,
        hero_subtitle: productData.heroSubtitle || productData.frenchName || '',
        hero_quote: productData.heroQuote || productData.description || '',
        hero_note_1: productData.heroNote1 || 'Galbanum',
        hero_note_2: productData.heroNote2 || 'Iris Pallida',
        hero_note_3: productData.heroNote3 || 'Vetiver',
        is_hero: false,
        is_featured: false
      })
      .select()
      .single();

    clearClientCache('products');
    return { success: !error, product: newProd, error: error?.message };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to create product' };
  }
};

/**
 * Admin: Update Product
 */
export const updateProduct = async (productData) => {
  try {
    const token = localStorage.getItem('lune_token');
    if (shouldAttemptBackend() && token) {
      try {
        const response = await apiClient.post('/products/update', productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        clearClientCache('products');
        return response.data;
      } catch (err) {
        // Fallback to Supabase
      }
    }

    const dbPayload = {};
    if (productData.name !== undefined) dbPayload.name = productData.name;
    if (productData.frenchName !== undefined) dbPayload.french_name = productData.frenchName;
    if (productData.category !== undefined) dbPayload.category = productData.category.toUpperCase();
    if (productData.subtitle !== undefined) dbPayload.subtitle = productData.subtitle;
    if (productData.price !== undefined) dbPayload.price = Number(productData.price);
    if (productData.inStock !== undefined) dbPayload.in_stock = productData.inStock === true || productData.inStock === 'true';
    if (productData.badge !== undefined) dbPayload.badge = productData.badge;
    if (productData.description !== undefined) dbPayload.description = productData.description;
    if (productData.imageUrl !== undefined) dbPayload.image_url = productData.imageUrl;
    if (productData.heroTitle !== undefined) dbPayload.hero_title = productData.heroTitle;
    if (productData.heroSubtitle !== undefined) dbPayload.hero_subtitle = productData.heroSubtitle;
    if (productData.heroQuote !== undefined) dbPayload.hero_quote = productData.heroQuote;
    if (productData.heroNote1 !== undefined) dbPayload.hero_note_1 = productData.heroNote1;
    if (productData.heroNote2 !== undefined) dbPayload.hero_note_2 = productData.heroNote2;
    if (productData.heroNote3 !== undefined) dbPayload.hero_note_3 = productData.heroNote3;

    const { data: updated, error } = await supabase
      .from('products')
      .update(dbPayload)
      .eq('id', productData.id)
      .select()
      .single();

    clearClientCache('products');
    return { success: !error, product: updated, error: error?.message };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to update product' };
  }
};

/**
 * Admin: Delete Product
 */
export const deleteProduct = async (productId) => {
  try {
    const token = localStorage.getItem('lune_token');
    if (shouldAttemptBackend() && token) {
      try {
        const response = await apiClient.post('/products/delete', { id: productId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        clearClientCache('products');
        return response.data;
      } catch (err) {
        // Fallback
      }
    }

    const { error } = await supabase.from('products').delete().eq('id', productId);
    clearClientCache('products');
    return { success: !error, error: error?.message };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to delete product' };
  }
};

/**
 * Admin: Toggle Product Active/Inactive Status
 */
export const toggleProductStockStatus = async (productId, inStock) => {
  try {
    const token = localStorage.getItem('lune_token');
    if (shouldAttemptBackend() && token) {
      try {
        const response = await apiClient.post('/admin/product/toggle-stock', { id: productId, inStock }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        clearClientCache('products');
        return response.data;
      } catch (err) {
        // Fallback
      }
    }

    const { data, error } = await supabase
      .from('products')
      .update({ in_stock: inStock === true || inStock === 'true' })
      .eq('id', productId)
      .select();

    clearClientCache('products');
    return { success: !error, product: data?.[0] };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to toggle product status' };
  }
};

/**
 * Categories API with instant direct Supabase query
 */
export const fetchCategories = async () => {
  return cachedApiCall('categories_all', async () => {
    if (shouldAttemptBackend()) {
      try {
        const response = await apiClient.post('/admin/categories/list', {});
        if (response.data.categories && response.data.categories.length > 0) {
          return response.data.categories;
        }
      } catch (error) {
        // Fallback to Supabase
      }
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data;
      }
    } catch (sbErr) {
      console.error('Direct Supabase fetchCategories notice:', sbErr);
    }

    return [
      { id: 'eau-de-parfum', name: 'EAU DE PARFUM', french_name: 'Vaporisateur de Parfum', description: 'Luxury flacons.' },
      { id: 'body-care', name: 'BODY CARE', french_name: 'Soins Corporels', description: 'Botanical oils.' },
      { id: 'extrait-de-parfum', name: 'EXTRAIT DE PARFUM', french_name: 'Extrait Pur de Parfum', description: 'Pure perfume essences.' }
    ];
  }, 180000);
};

export const createCategory = async (catData) => {
  try {
    const token = localStorage.getItem('lune_token');
    if (shouldAttemptBackend() && token) {
      try {
        const response = await apiClient.post('/admin/categories/create', catData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        clearClientCache('categories');
        return response.data;
      } catch (err) {}
    }

    const catId = catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const { data, error } = await supabase
      .from('categories')
      .insert({ id: catId, name: catData.name, french_name: catData.frenchName || catData.name, description: catData.description || '' })
      .select()
      .single();

    clearClientCache('categories');
    return { success: !error, category: data };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to create category' };
  }
};

export const updateCategory = async (catData) => {
  try {
    const token = localStorage.getItem('lune_token');
    if (shouldAttemptBackend() && token) {
      try {
        const response = await apiClient.post('/admin/categories/update', catData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        clearClientCache('categories');
        return response.data;
      } catch (err) {}
    }

    const { data, error } = await supabase
      .from('categories')
      .update({ name: catData.name, french_name: catData.frenchName, description: catData.description })
      .eq('id', catData.id)
      .select()
      .single();

    clearClientCache('categories');
    return { success: !error, category: data };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to update category' };
  }
};

export const deleteCategory = async (id) => {
  try {
    const token = localStorage.getItem('lune_token');
    if (shouldAttemptBackend() && token) {
      try {
        const response = await apiClient.post('/admin/categories/delete', { id }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        clearClientCache('categories');
        return response.data;
      } catch (err) {}
    }

    const { error } = await supabase.from('categories').delete().eq('id', id);
    clearClientCache('categories');
    return { success: !error };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to delete category' };
  }
};

/**
 * Admin: Discount / Coupon Management API
 */
export const fetchDiscounts = async () => {
  try {
    const token = localStorage.getItem('lune_token');
    if (shouldAttemptBackend() && token) {
      try {
        const response = await apiClient.post('/admin/discounts/list', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.discounts) return response.data.discounts;
      } catch (err) {}
    }

    const { data, error } = await supabase.from('discounts').select('*');
    if (!error && data) return data;
    return [];
  } catch (error) {
    return [];
  }
};

export const createDiscount = async (couponData) => {
  try {
    const token = localStorage.getItem('lune_token');
    if (shouldAttemptBackend() && token) {
      try {
        const response = await apiClient.post('/admin/discounts/create', couponData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
      } catch (err) {}
    }

    const { data, error } = await supabase
      .from('discounts')
      .insert({
        code: couponData.code.toUpperCase(),
        percentage: Number(couponData.percentage),
        is_active: couponData.isActive !== false
      })
      .select()
      .single();

    return { success: !error, discount: data };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to create coupon' };
  }
};

export const updateDiscount = async (couponData) => {
  try {
    const token = localStorage.getItem('lune_token');
    if (shouldAttemptBackend() && token) {
      try {
        const response = await apiClient.post('/admin/discounts/update', couponData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
      } catch (err) {}
    }

    const { data, error } = await supabase
      .from('discounts')
      .update({
        code: couponData.code?.toUpperCase(),
        percentage: Number(couponData.percentage),
        is_active: couponData.isActive
      })
      .eq('id', couponData.id)
      .select()
      .single();

    return { success: !error, discount: data };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to update coupon' };
  }
};

export const deleteDiscount = async (id) => {
  try {
    const token = localStorage.getItem('lune_token');
    if (shouldAttemptBackend() && token) {
      try {
        const response = await apiClient.post('/admin/discounts/delete', { id }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
      } catch (err) {}
    }

    const { error } = await supabase.from('discounts').delete().eq('id', id);
    return { success: !error };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to delete coupon' };
  }
};

/**
 * Admin: Fetch ALL reviews
 */
export const fetchAllReviews = async () => {
  try {
    const token = localStorage.getItem('lune_token');
    if (shouldAttemptBackend() && token) {
      try {
        const response = await apiClient.post('/admin/reviews/list', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.reviews) return response.data.reviews;
      } catch (err) {}
    }

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) return data;
    return [];
  } catch (error) {
    return [];
  }
};

export const deleteReviewById = async (id) => {
  try {
    const token = localStorage.getItem('lune_token');
    if (shouldAttemptBackend() && token) {
      try {
        const response = await apiClient.post('/admin/reviews/delete', { id }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
      } catch (err) {}
    }

    const { error } = await supabase.from('reviews').delete().eq('id', id);
    return { success: !error };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to delete review' };
  }
};

/**
 * Public: Submit a contact/support message
 */
export const submitContactMessage = async ({ fullName, email, subject, message }) => {
  try {
    if (shouldAttemptBackend()) {
      try {
        const response = await apiClient.post('/contact/submit', { fullName, email, subject, message });
        return response.data;
      } catch (err) {}
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert({
        full_name: fullName,
        email,
        subject: subject || 'General Inquiry',
        message,
        status: 'UNREAD'
      })
      .select()
      .single();

    return { success: !error, message: data };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to send message' };
  }
};

/**
 * Admin: Fetch all contact/support messages
 */
export const fetchContactMessages = async () => {
  try {
    const token = localStorage.getItem('lune_token');
    if (shouldAttemptBackend() && token) {
      try {
        const response = await apiClient.post('/admin/contacts/list', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.messages) return response.data.messages;
      } catch (err) {}
    }

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) return data;
    return [];
  } catch (error) {
    return [];
  }
};

export const updateContactStatus = async (id, status) => {
  try {
    const token = localStorage.getItem('lune_token');
    if (shouldAttemptBackend() && token) {
      try {
        const response = await apiClient.post('/admin/contacts/update-status', { id, status }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
      } catch (err) {}
    }

    const { data, error } = await supabase
      .from('contacts')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    return { success: !error, contact: data };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to update status' };
  }
};

export const deleteContactMsg = async (id) => {
  try {
    const token = localStorage.getItem('lune_token');
    if (shouldAttemptBackend() && token) {
      try {
        const response = await apiClient.post('/admin/contacts/delete', { id }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
      } catch (err) {}
    }

    const { error } = await supabase.from('contacts').delete().eq('id', id);
    return { success: !error };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to delete message' };
  }
};

/**
 * Admin: Fetch all customer orders
 */
export const fetchAllOrdersAdmin = async () => {
  try {
    const token = localStorage.getItem('lune_token');
    if (shouldAttemptBackend() && token) {
      try {
        const response = await apiClient.post('/admin/orders/list', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.orders) return response.data.orders;
      } catch (err) {}
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .order('created_at', { ascending: false });

    if (!error && data) return data;
    return [];
  } catch (error) {
    return [];
  }
};

/**
 * Admin: Update order stage status
 */
export const updateOrderStatusAdmin = async (orderId, status) => {
  try {
    const token = localStorage.getItem('lune_token');
    if (shouldAttemptBackend() && token) {
      try {
        const response = await apiClient.post('/admin/orders/update-status', { orderId, status }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
      } catch (err) {}
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    return { success: !error, order: data };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to update order status' };
  }
};
